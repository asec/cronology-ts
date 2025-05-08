import express, {Express, Request, Response} from "express";
import * as fs from "fs";
import {createServer} from "https";
import cors from "cors";
import bodyParser from "body-parser";
import ApiAction from "../lib/api/action/ApiAction.js";
import ApiResponse, {ApiResponseDTO} from "../lib/api/action/response/ApiResponse.js";
import {EnvType} from "../lib/config/Config.js";
import {HttpMethod} from "../lib/api/Http.js";
import IServer, {ParamsParserClass} from "../lib/server/IServer.js";
import ApiErrorResponse, {ApiErrorResponseDTO} from "../lib/api/action/response/ApiErrorResponse.js";
import AppConfig from "../config/AppConfig.js";
import ServiceContainer from "../lib/service/ServiceContainer.js";
import HttpError from "../lib/error/HttpError.js";
import {ApiParamsDTO} from "../lib/api/action/params/ApiActionParams.js";

export default class WebServer implements IServer
{
    private app: Express = express();

    public constructor(
        private config: AppConfig,
        private services: ServiceContainer
    )
    {}

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

        return server;
    }

    private createRequestHandler<TRequest extends Request, TResponseDTO extends ApiResponseDTO, TParamsDTO extends ApiParamsDTO>(
        action: ApiAction<TResponseDTO, TParamsDTO>,
        paramsParserClass: ParamsParserClass<TRequest, TParamsDTO> = null
    )
    {
        return async (req: TRequest, res: Response) => {
            let result: ApiResponse<any>;
            try
            {
                if (paramsParserClass !== null)
                {
                    const paramsParser = this.services.resolve(paramsParserClass, {
                        request: req
                    });
                    const params = await paramsParser.parse();
                    await params.validate();
                    action.setParams(params);
                }

                result = await action.execute();
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
        const server = this.createServer();

        server.listen(this.config.get("CONF_API_PORT"), () => {
            console.log("[api-server]", "info", {message: `Server started on https://localhost:${this.config.get("CONF_API_PORT")}`});
        });

        if (typeof errorHandler !== "undefined")
        {
            server.on("error", (err: Error) => {
                errorHandler(err);
            });
        }
    }

    public defineRoute<TResponseDTO extends ApiResponseDTO, TParamsDTO extends ApiParamsDTO>(
        method: HttpMethod,
        endpoint: string,
        action: ApiAction<TResponseDTO, TParamsDTO>,
        paramsParserClass: ParamsParserClass<Request, TParamsDTO> = null
    ): void
    {
        this.app[method](endpoint, this.createRequestHandler(action, paramsParserClass));
    }
}