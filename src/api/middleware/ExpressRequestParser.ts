import ApiAction from "../../lib/api/action/ApiAction.js";
import express from "express";
import {ApiResponseDTO} from "../../lib/api/action/response/ApiResponse.js";
import {ApiParamsDTO} from "../../lib/api/action/params/ApiActionParams.js";
import {DataObject} from "../../lib/datastructures/DataObject.js";
import ActionMiddleware from "../../lib/api/action/ActionMiddleware.js";
import CronologyError from "../../lib/error/CronologyError.js";

export class ExpressContext extends DataObject
{
    public request: express.Request
}

export default abstract class ExpressRequestParser extends ActionMiddleware<ExpressContext, ApiAction<ApiResponseDTO, ApiParamsDTO>>
{
    protected validate(action: ApiAction<ApiResponseDTO, ApiParamsDTO>, context: ExpressContext): Promise<void>
    {
        if (!(context instanceof ExpressContext))
        {
            throw new CronologyError(
                `Invalid context in middleware: '${this.constructor.name}'. ` +
                `Needs '${ExpressContext.name}'.`
            );
        }

        return null;
    }
}