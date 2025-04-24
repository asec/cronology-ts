import {HttpMethod} from "../api/Http";
import ApiAction from "../../lib/api/action/ApiAction";
import {Request} from "express";
import {BeanContents} from "../datastructures/Bean";
import IExpressRequestParser from "./IExpressRequestParser";

export type ParamsParserClass<TRequest extends Request, TParamsContent extends BeanContents> = new(request: TRequest, ...params: any) => IExpressRequestParser<TParamsContent>

export default interface IServer
{
    start(errorHandler?: (error: Error) => void): void;
    defineRoute(method: HttpMethod, endpoint: string, action: ApiAction<any, any>, paramsParserClass?: ParamsParserClass<Request, BeanContents>): void;
}