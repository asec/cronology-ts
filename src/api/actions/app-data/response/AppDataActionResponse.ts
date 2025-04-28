import ApiResponse, {ApiResponseContent} from "../../../../lib/api/action/response/ApiResponse.js";
import {HttpStatus} from "../../../../lib/api/Http.js";
import {ApplicationProps} from "../../../../entities/Application.js";

export class AppDataActionResponseContent extends ApiResponseContent
{
    result: ApplicationProps = {
        name: undefined,
        uuid: undefined,
        ip: []
    }
}

export default class AppDataActionResponse extends ApiResponse<AppDataActionResponseContent>
{
    constructor(props?: AppDataActionResponseContent, status?: HttpStatus)
    {
        props.result.ip = props.result.ip || [];
        super(AppDataActionResponseContent, props, status);
    }
}