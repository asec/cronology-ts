import ApiAction from "../../../lib/api/action/ApiAction.js";
import ApiResponse, {ApiResponseContent} from "../../../lib/api/action/response/ApiResponse.js";
import {EmptyActionParamsContent} from "../../../lib/api/action/params/EmptyActionParams.js";
import CronologyError from "../../../lib/error/CronologyError.js";

export default class TestErrorAction extends ApiAction<ApiResponseContent, EmptyActionParamsContent>
{
    public execute(): Promise<ApiResponse<ApiResponseContent>>
    {
        throw new CronologyError("Teszt error");
    }
}