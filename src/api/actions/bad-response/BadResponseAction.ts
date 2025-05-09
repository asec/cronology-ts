import ApiAction from "../../../lib/api/action/ApiAction.js";
import ApiResponse, {ApiResponseDTO} from "../../../lib/api/action/response/ApiResponse.js";
import CronologyError from "../../../lib/error/CronologyError.js";
import {EmptyActionParamsDTO} from "../../../lib/api/action/params/EmptyActionParams.js";

export default class BadResponseAction extends ApiAction<ApiResponseDTO, EmptyActionParamsDTO>
{
    public async do(): Promise<ApiResponse<ApiResponseDTO>>
    {
        throw new CronologyError("The API returned an invalid response for route: 'get /bad-response'.");
    }

}