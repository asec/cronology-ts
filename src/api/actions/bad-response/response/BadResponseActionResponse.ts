import ApiResponse, {ApiResponseContent} from "../../../../lib/api/action/response/ApiResponse";
import {HttpStatus} from "../../../../lib/api/Http";

export default class BadResponseActionResponse extends ApiResponse<ApiResponseContent>
{
    constructor(props?: ApiResponseContent, status?: HttpStatus)
    {
        super(ApiResponseContent, props, status);
    }
}