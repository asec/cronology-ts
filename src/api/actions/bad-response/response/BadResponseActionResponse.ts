import ApiResponse, {ApiResponseContent} from "../../../../lib/api/action/response/ApiResponse.js";
import {HttpStatus} from "../../../../lib/api/Http.js";

export default class BadResponseActionResponse extends ApiResponse<ApiResponseContent>
{
    constructor(props?: ApiResponseContent, status?: HttpStatus)
    {
        super(ApiResponseContent, props, status);
    }
}