import ApiAction from "../../../lib/api/action/ApiAction";
import {EmptyActionParamsContent} from "../../../lib/api/action/params/EmptyActionParams";
import {ApiResponseContent} from "../../../lib/api/action/response/ApiResponse";
import BadResponseActionResponse from "./response/BadResponseActionResponse";
import CronologyError from "../../../lib/error/CronologyError";

export default class BadResponseAction extends ApiAction<ApiResponseContent, EmptyActionParamsContent>
{
    execute(): Promise<BadResponseActionResponse>
    {
        throw new CronologyError("The API returned an invalid response for route: 'get /bad-response'.");
    }

}