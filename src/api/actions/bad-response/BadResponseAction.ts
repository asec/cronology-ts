import ApiAction from "../../../lib/api/action/ApiAction.js";
import {EmptyActionParamsContent} from "../../../lib/api/action/params/EmptyActionParams.js";
import {ApiResponseContent} from "../../../lib/api/action/response/ApiResponse.js";
import BadResponseActionResponse from "./response/BadResponseActionResponse.js";
import CronologyError from "../../../lib/error/CronologyError.js";

export default class BadResponseAction extends ApiAction<ApiResponseContent, EmptyActionParamsContent>
{
    execute(): Promise<BadResponseActionResponse>
    {
        throw new CronologyError("The API returned an invalid response for route: 'get /bad-response'.");
    }

}