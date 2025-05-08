import ApiAction from "../../../lib/api/action/ApiAction.js";
import ApiResponse, {ApiResponseDTO} from "../../../lib/api/action/response/ApiResponse.js";
import CronologyError from "../../../lib/error/CronologyError.js";
import {EmptyActionParamsDTO} from "../../../lib/api/action/params/EmptyActionParams.js";

export default class TestErrorAction extends ApiAction<ApiResponseDTO, EmptyActionParamsDTO>
{
    public execute(): ApiResponse<ApiResponseDTO>
    {
        throw new CronologyError("Teszt error");
    }
}