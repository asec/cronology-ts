import Bean, {BeanContents} from "../../../datastructures/Bean";
import {Request} from "express";

abstract class ApiActionParams<TParamsContent extends BeanContents> extends Bean<TParamsContent>
{
    abstract parseRequest(req: Request<any, any, any, any, any>): void;
    abstract bind(props: {}): void;
}

export default ApiActionParams;