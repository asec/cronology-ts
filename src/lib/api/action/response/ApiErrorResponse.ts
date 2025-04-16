import ApiResponse, {ApiResponseContent} from "./ApiResponse";
import {HttpStatus} from "../../Http";

export class ApiErrorResponseContent extends ApiResponseContent
{
    public success: boolean = false;
    public error: string = "";
}

export default class ApiErrorResponse extends ApiResponse<ApiErrorResponseContent>
{
    public status: HttpStatus = HttpStatus.Error;
    public displayMessage: string = "An unexpected error occurred while processing your request.";

    public constructor(props?: ApiErrorResponseContent, status?: HttpStatus, displayMessage?: string)
    {
        super(ApiErrorResponseContent, props, status);
        if (displayMessage)
        {
            this.displayMessage = displayMessage;
        }
    }
}