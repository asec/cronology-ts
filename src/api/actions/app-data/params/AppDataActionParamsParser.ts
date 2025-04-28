import IExpressRequestParser from "../../../../lib/server/IExpressRequestParser.js";
import AppDataActionParams, {AppDataActionParamsContent} from "./AppDataActionParams.js";
import {Request} from "express";
import {AppDataActionResponseContent} from "../response/AppDataActionResponse.js";
import ApplicationFactory from "../../../../entities/factory/ApplicationFactory.js";

interface RequestParams
{
    [key: string]: string
    uuid: string
}

type AppDataActionRequest = Request<RequestParams, AppDataActionResponseContent>;

export default class AppDataActionParamsParser implements IExpressRequestParser<AppDataActionParamsContent>
{
    public constructor(
        protected request: AppDataActionRequest,
        protected factory: ApplicationFactory
    )
    {}

    public async parse(): Promise<AppDataActionParams>
    {
        return new AppDataActionParams(this.factory, {
            uuid: this.request.params.uuid
        });
    }
}