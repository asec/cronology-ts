import ApiResponse, {ApiResponseContent} from "../../../../lib/api/action/response/ApiResponse.js";
import {HttpStatus} from "../../../../lib/api/Http.js";

export class WaitActionResponseContent extends ApiResponseContent
{
    public waited: number = undefined;
}

export default class WaitActionResponse extends ApiResponse<WaitActionResponseContent>
{
    constructor(props?: WaitActionResponseContent, status?: HttpStatus)
    {
        super(WaitActionResponseContent, props, status);
    }
}