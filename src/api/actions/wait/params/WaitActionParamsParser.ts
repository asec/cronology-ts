import {Request} from "express";
import {WaitActionResponseContent} from "../response/WaitActionResponse";
import WaitActionParams, {WaitActionParamsContent, WaitActionParamsContentRaw} from "./WaitActionParams";
import IExpressRequestParser from "../../../../lib/server/IExpressRequestParser";

type WaitActionRequest = Request<{}, WaitActionResponseContent, {}, WaitActionParamsContentRaw>;

export default class WaitActionParamsParser implements IExpressRequestParser<WaitActionParamsContent>
{
    public constructor(
        protected request: WaitActionRequest
    )
    {}

    public parse(): WaitActionParams
    {
        const raw: WaitActionParamsContentRaw = {
            ms: this.request.query.ms || "1000"
        };

        const params = new WaitActionParams();
        params.bind(raw);

        return params;
    }
}