import ApiAction from "../../lib/api/action/ApiAction.js";
import {ApiResponseDTO} from "../../lib/api/action/response/ApiResponse.js";
import {ApiParamsDTO} from "../../lib/api/action/params/ApiActionParams.js";
import {DataObject} from "../../lib/datastructures/DataObject.js";
import Middleware from "../../lib/api/action/Middleware.js";
import CronologyError from "../../lib/error/CronologyError.js";

export class CliContext<TOptions extends Record<string, any> = Record<string, any>> extends DataObject
{
    public args: string[] = [];
    public options: TOptions = {} as TOptions;
}

export default abstract class CliParamsParser extends Middleware<CliContext, ApiAction<ApiResponseDTO, ApiParamsDTO>>
{
    protected validate(action: ApiAction<ApiResponseDTO, ApiParamsDTO>, context: CliContext): Promise<void>
    {
        if (!(context instanceof CliContext))
        {
            throw new CronologyError(
                `Invalid context in middleware: '${this.constructor.name}'. ` +
                `Needs '${CliContext.name}'.`
            );
        }

        return null;
    }
}