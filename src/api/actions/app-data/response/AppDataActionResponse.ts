import ApiResponse, {ApiResponseContent} from "../../../../lib/api/action/response/ApiResponse";
import {HttpStatus} from "../../../../lib/api/Http";
import {ApplicationProps} from "../../../../entities/Application";

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