import ExpressRequestParser from "../../../middleware/ExpressRequestParser.js";
import WaitActionParams, {WaitActionParamsDTO} from "./WaitActionParams.js";
import express from "express";

type Request = express.Request<unknown, unknown, unknown, {ms: string}>;

export default class WaitActionParamsParserExpress extends ExpressRequestParser
{
    protected do(action, context, next)
    {
        const req = (context.request as Request);
        const data = new WaitActionParamsDTO();

        data.bind({
            ms: req.query.ms ? Number(req.query.ms) : data.get("ms")
        });

        action.setParams(new WaitActionParams(data));

        return next();
    }

}