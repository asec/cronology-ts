import ApiResponse, {ApiResponseDTO} from "./ApiResponse.js";
import {HttpStatus} from "../../Http.js";

export class ApiErrorResponseDTO extends ApiResponseDTO
{
    public success: false = false;
    public error: string = "";
}

export default class ApiErrorResponse extends ApiResponse<ApiErrorResponseDTO>
{
    public status: HttpStatus = HttpStatus.Error;
    public displayMessage: string = "An unexpected error occurred while processing your request.";
}