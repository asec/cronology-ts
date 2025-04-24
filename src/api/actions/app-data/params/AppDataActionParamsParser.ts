import IExpressRequestParser from "../../../../lib/server/IExpressRequestParser";
import AppDataActionParams, {AppDataActionParamsContent} from "./AppDataActionParams";
import {Request} from "express";
import {AppDataActionResponseContent} from "../response/AppDataActionResponse";
import ApplicationFactory from "../../../../entities/factory/ApplicationFactory";

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