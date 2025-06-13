import express, {Express, Request, Response} from "express";
import * as fs from "fs";
import {createServer, Server} from "https";
import cors from "cors";
import bodyParser from "body-parser";
import ApiAction from "../lib/api/action/ApiAction.js";
import ApiResponse, {ApiResponseDTO} from "../lib/api/action/response/ApiResponse.js";
import {EnvType} from "../lib/config/Config.js";
import {HttpMethod} from "../lib/api/Http.js";
import IServer from "../lib/server/IServer.js";
import ApiErrorResponse, {ApiErrorResponseDTO} from "../lib/api/action/response/ApiErrorResponse.js";
import AppConfig from "../config/AppConfig.js";
import HttpError from "../lib/error/HttpError.js";
import {ApiParamsDTO} from "../lib/api/action/params/ApiActionParams.js";
import {ExpressContext} from "./middleware/ExpressRequestParser.js";
import ILogger from "../lib/logger/ILogger.js";

export default class WebServer implements IServer
{
    private app: Express = express();
    private readonly server: Server;

    public constructor(
        private config: AppConfig,
        private logger: ILogger
    )
    {
        this.server = this.createServer();
    }

    private createServer()
    {
        const app = this.app;
        const credentials = {
            key: fs.readFileSync(this.config.get("CONF_API_HTTPS_PRIVATEKEY"), 'utf8'),
            cert: fs.readFileSync(this.config.get("CONF_API_HTTPS_CERTIFICATE"), 'utf8')
        };
        const server = createServer(credentials, app);
        app.use(cors());
        app.use(bodyParser.json());
        app.use(async (req, res, next) => {
            const chunks: string[] = [];
            const originalSend = res.send;

            res.send = (body: any) => {
                if (typeof body === "object")
                {
                    try
                    {
                        chunks.push(JSON.stringify(body));
                    }
                    catch
                    {
                        chunks.push("Error: unserializable json");
                    }
                }
                else if (typeof body === "string")
                {
                    chunks.push(body);
                }
                else
                {
                    chunks.push("Error: un-loggable body");
                }

                return originalSend.call(res, body);
            };

            await this.logger.info(`Request: ${req.method} ${req.path}`, {
                query: req.query,
                params: req.params,
                body: req.body
            });
            res.on("finish", async () => {
                await this.logger.info(`Response: ${res.statusCode}`, {
                    headers: res.getHeaders(),
                    body: chunks.join("")
                });
            });

            next();
        });

        return server;
    }

    private createRequestHandler<TRequest extends Request, TResponseDTO extends ApiResponseDTO, TParamsDTO extends ApiParamsDTO>(
        action: ApiAction<TResponseDTO, TParamsDTO>
    )
    {
        return async (req: TRequest, res: Response) => {
            let result: ApiResponse<any>;
            try
            {
                const context = new ExpressContext();
                context.bind({
                    request: req
                });

                result = await action.execute(context);
            }
            catch (error: unknown)
            {
                if (error instanceof HttpError)
                {
                    let response = new ApiErrorResponse(new ApiErrorResponseDTO());
                    response.bind({
                        dataObj: {
                            success: false,
                            error: (<Error> error).message
                        },
                        status: error.status
                    });

                    result = response;
                }
                else
                {
                    let response = new ApiErrorResponse(new ApiErrorResponseDTO());
                    response.bind({
                        dataObj: {
                            success: false,
                            error: (<Error> error).message
                        }
                    });

                    result = response;
                }
                if (this.config.isCurrentEnv(EnvType.Prod))
                {
                    (<ApiErrorResponse> result).bind({
                        dataObj: {
                            success: (<ApiErrorResponse> result).data("success"),
                            error: (<ApiErrorResponse> result).displayMessage
                        }
                    });
                }
            }

            res.status(result.status);
            res.json(result.toObject());
        }
    }

    public start(errorHandler?: (error: Error) => void)
    {
        const server = this.server;

        server.listen(this.config.get("CONF_API_PORT"), async () => {
            console.log("[api-server]", "info", {message: `Server started on https://localhost:${this.config.get("CONF_API_PORT")}`});
            await this.logger.info(`Server started on https://localhost:${this.config.get("CONF_API_PORT")}`);
        });

        if (typeof errorHandler !== "undefined")
        {
            server.on("error", async (err: Error) => {
                errorHandler(err);
                await this.logger.error("Server error", {error: err});
            });
        }
    }

    public defineRoute<TResponseDTO extends ApiResponseDTO, TParamsDTO extends ApiParamsDTO>(
        method: HttpMethod,
        endpoint: string,
        action: ApiAction<TResponseDTO, TParamsDTO>
    ): void
    {
        this.app[method](endpoint, this.createRequestHandler(action));
    }
}