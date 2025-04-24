import express, {Express, Request, Response} from "express";
import * as fs from "fs";
import {createServer} from "https";
import cors from "cors";
import bodyParser from "body-parser";
import {BeanContents} from "../lib/datastructures/Bean";
import ApiAction from "../lib/api/action/ApiAction";
import ApiResponse, {ApiResponseContent} from "../lib/api/action/response/ApiResponse";
import {EnvType} from "../lib/config/Config";
import {HttpMethod, HttpStatus} from "../lib/api/Http";
import IServer, {ParamsParserClass} from "../lib/server/IServer";
import ApiErrorResponse from "../lib/api/action/response/ApiErrorResponse";
import AppConfig from "../config/AppConfig";
import ServiceContainer from "../lib/service/ServiceContainer";
import HttpError from "../lib/error/HttpError";

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

    private createRequestHandler<TRequest extends Request, TResponseContent extends ApiResponseContent, TParamsContent extends BeanContents>(
        action: ApiAction<TResponseContent, TParamsContent>,
        paramsParserClass: ParamsParserClass<TRequest, TParamsContent> = null
    )
    {
        return async (req: TRequest, res: Response<TResponseContent>) => {
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
                    console.log("is http error", error);
                    result = new ApiErrorResponse({
                        success: false,
                        error: (<Error> error).message
                    }, error.status);
                }
                else
                {
                    result = new ApiErrorResponse({
                        success: false,
                        error: (<Error> error).message
                    }, HttpStatus.Error);
                }
                if (this.config.isCurrentEnv(EnvType.Prod))
                {
                    (<ApiErrorResponse> result).set("error", (<ApiErrorResponse> result).displayMessage);
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

    public defineRoute<TResponseContent extends ApiResponseContent, TParamsContent extends BeanContents>(
        method: HttpMethod,
        endpoint: string,
        action: ApiAction<TResponseContent, TParamsContent>,
        paramsParserClass: ParamsParserClass<Request, TParamsContent> = null
    ): void
    {
        this.app[method](endpoint, this.createRequestHandler(action, paramsParserClass));
    }
}