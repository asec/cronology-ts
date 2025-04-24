import {Request} from "express";
import {WaitActionResponseContent} from "../response/WaitActionResponse.js";
import WaitActionParams, {WaitActionParamsContent, WaitActionParamsContentRaw} from "./WaitActionParams.js";
import IExpressRequestParser from "../../../../lib/server/IExpressRequestParser.js";

type WaitActionRequest = Request<{}, WaitActionResponseContent, {}, WaitActionParamsContentRaw>;

export default class WaitActionParamsParser implements IExpressRequestParser<WaitActionParamsContent>
{
    public constructor(
        protected request: WaitActionRequest
    )
    {}

    public async parse(): Promise<WaitActionParams>
    {
        const raw: WaitActionParamsContentRaw = {
            ms: this.request.query.ms || "1000"
        };

        const params = new WaitActionParams();
        params.bind(raw);

        return params;
    }
}