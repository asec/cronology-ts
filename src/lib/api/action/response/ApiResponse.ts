import Bean, {BeanContents} from "../../../datastructures/Bean.js";
import {HttpStatus} from "../../Http.js";

export class ApiResponseContent extends BeanContents
{
    public success: boolean = undefined;
}

export default class ApiResponse<TResponseContent extends ApiResponseContent> extends Bean<TResponseContent>
{
    public status: HttpStatus = HttpStatus.Ok;

    public constructor(c: new() => TResponseContent, props?: TResponseContent, status?: HttpStatus)
    {
        super(c, props);
        if (typeof status !== "undefined")
        {
            this.status = status;
        }
    }
}