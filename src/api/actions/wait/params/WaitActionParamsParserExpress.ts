import {ExpressRequestParser} from "../../../middleware/ExpressRequestParser.js";
import WaitActionParams, {WaitActionParamsDTO} from "./WaitActionParams.js";
import express from "express";

type Request = express.Request<unknown, unknown, unknown, {ms: string}>;

export const WaitActionParamsParserExpress: ExpressRequestParser = async (action, context, next): Promise<void> => {
    const data = new WaitActionParamsDTO();
    let req = (context as Request);

    data.bind({
        ms: Number(req.query.ms) || data.get("ms")
    });

    action.setParams(new WaitActionParams(data));

    return next();
};