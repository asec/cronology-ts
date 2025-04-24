import ApiResponse, {ApiResponseContent} from "./ApiResponse.js";
import {HttpStatus} from "../../Http.js";

export class ApiErrorResponseContent extends ApiResponseContent
{
    public success: boolean = false;
    public error: string = "";
}

export default class ApiErrorResponse extends ApiResponse<ApiErrorResponseContent>
{
    public constructor(
        props?: ApiErrorResponseContent,
        status: HttpStatus = HttpStatus.Error,
        public displayMessage: string = "An unexpected error occurred while processing your request."
    )
    {
        super(ApiErrorResponseContent, props, status);
    }
}