import express, {Express, Request, Response} from "express";
import * as fs from "fs";
import {createServer} from "https";
import cors from "cors";
import bodyParser from "body-parser";
import Api from "../lib/api/Api";
import PingAction from "./actions/ping/PingAction";
import WaitAction from "./actions/wait/WaitAction";
import WaitActionParams from "./actions/wait/params/WaitActionParams";
import ApiActionParams from "../lib/api/action/params/ApiActionParams";
import {BeanContents} from "../lib/datastructures/Bean";
import ApiAction from "../lib/api/action/ApiAction";
import EmptyActionParams from "../lib/api/action/params/EmptyActionParams";
import {ApiResponseContent} from "../lib/api/action/response/ApiResponse";
require("./Routes");

class WebServer
{
    static #app: Express = express();

    static #createServer()
    {
        const app = this.#app;
        const credentials = {
            key: fs.readFileSync(process.env.CONF_API_HTTPS_PRIVATEKEY, 'utf8'),
            cert: fs.readFileSync(process.env.CONF_API_HTTPS_CERTIFICATE, 'utf8')
        };
        const server = createServer(credentials, app);
        app.use(cors());
        app.use(bodyParser.json());

        return server;
    }

    static start()
    {
        const app = this.#app;
        const server = this.#createServer();

        server.listen(process.env.CONF_API_PORT, () => {
            console.log("[api-server]", "info", {message: "Server started on " + process.env.CONF_API_PORT});
        });

        const routes = Api.getRoutes();
        console.log(routes);
        /*for (let endpoint in routes)
        {
            for (let i = 0; i < routes[endpoint].)
            routes[endpoint].forEach(route => {
                console.log(endpoint, route);
            });
        }*/
        app["get"]("/", createRequestHandler(PingAction));
        app["get"]("/wait", createRequestHandler(WaitAction, WaitActionParams));
    }
}

function createRequestHandler<
    TRequest extends Request,
    TResponseContent extends ApiResponseContent,
    TParamsContent extends BeanContents
>(
    actionClass: new() => ApiAction<TResponseContent, TParamsContent>,
    actionParamsClass: new() => ApiActionParams<TParamsContent> = null
): (req: TRequest, res: Response<TResponseContent>) => Promise<void>
{
    return async (req: TRequest, res: Response<TResponseContent>) => {
        const action = new actionClass();
        if (actionParamsClass !== null && actionParamsClass !== EmptyActionParams)
        {
            const params = new actionParamsClass();
            params.parseRequest(req);
            action.setParams(params);
        }

        const result = await Api.executeCommand(action);
        res.status(result.status);
        res.json(result.toObject());
    }
}

export {createRequestHandler};
export default WebServer;