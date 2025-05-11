import ApiAction from "../../../lib/api/action/ApiAction.js";
import ApiResponse, {ApiResponseDTO} from "../../../lib/api/action/response/ApiResponse.js";
import {EmptyActionParamsDTO} from "../../../lib/api/action/params/EmptyActionParams.js";
import {HttpStatus} from "../../../lib/api/Http.js";
import ApiErrorResponse, {ApiErrorResponseDTO} from "../../../lib/api/action/response/ApiErrorResponse.js";

export default class BadResponseAction extends ApiAction<ApiResponseDTO, EmptyActionParamsDTO>
{
    public async do(): Promise<ApiResponse<ApiResponseDTO>>
    {
        const response = new ApiErrorResponse(new ApiErrorResponseDTO());
        response.bind({
            dataObj: {
                error: "The API returned an invalid response for route: 'get /bad-response'."
            },
            status: HttpStatus.Unprocessable
        });

        return response;
    }

}