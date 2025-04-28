import {HttpMethod} from "../api/Http.js";
import ApiAction from "../../lib/api/action/ApiAction.js";
import {Request} from "express";
import {BeanContents} from "../datastructures/Bean.js";
import IExpressRequestParser from "./IExpressRequestParser.js";

export type ParamsParserClass<TRequest extends Request, TParamsContent extends BeanContents> = new(request: TRequest, ...params: any) => IExpressRequestParser<TParamsContent>

export default interface IServer
{
    start(errorHandler?: (error: Error) => void): void;
    defineRoute(method: HttpMethod, endpoint: string, action: ApiAction<any, any>, paramsParserClass?: ParamsParserClass<Request, BeanContents>): void;
}