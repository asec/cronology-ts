import ApiResponse, {ApiResponseContent} from "../../../../lib/api/action/response/ApiResponse";
import {HttpStatus} from "../../../../lib/api/Http";

export class PingActionResponseContent extends ApiResponseContent
{
    public version: string = undefined;
}

export default class PingActionResponse extends ApiResponse<PingActionResponseContent>
{
    constructor(props?: PingActionResponseContent, status?: HttpStatus)
    {
        super(PingActionResponseContent, props, status);
    }
}