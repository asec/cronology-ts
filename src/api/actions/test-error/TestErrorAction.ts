import ApiAction from "../../../lib/api/action/ApiAction";
import ApiResponse, {ApiResponseContent} from "../../../lib/api/action/response/ApiResponse";
import {EmptyActionParamsContent} from "../../../lib/api/action/params/EmptyActionParams";
import CronologyError from "../../../lib/error/CronologyError";

export default class TestErrorAction extends ApiAction<ApiResponseContent, EmptyActionParamsContent>
{
    public execute(): Promise<ApiResponse<ApiResponseContent>>
    {
        throw new CronologyError("Teszt error");
    }
}