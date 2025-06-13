import {HttpMethod} from "../api/Http.js";
import ApiAction from "../../lib/api/action/ApiAction.js";
import {Request} from "express";
import IExpressRequestParser from "./IExpressRequestParser.js";
import {ApiParamsDTO} from "../api/action/params/ApiActionParams.js";

export type ParamsParserClass<TRequest extends Request, TParamsContent extends ApiParamsDTO> = new(request: TRequest, ...params: any) => IExpressRequestParser<TParamsContent>

export default interface IServer
{
    create(): void;
    start(errorHandler?: (error: Error) => void): void;
    defineRoute(method: HttpMethod, endpoint: string, action: ApiAction<any, any>, paramsParserClass?: ParamsParserClass<Request, ApiParamsDTO>): void;
}