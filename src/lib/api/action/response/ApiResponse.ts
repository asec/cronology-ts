import Bean, {BeanContents} from "../../../datastructures/Bean.js";
import {HttpStatus} from "../../Http.js";

export class ApiResponseContent extends BeanContents
{
    public success: boolean = undefined;
}

export default class ApiResponse<TResponseContent extends ApiResponseContent> extends Bean<TResponseContent>
{
    public constructor(
        c: new() => TResponseContent,
        props?: TResponseContent,
        public status: HttpStatus = HttpStatus.Ok
    )
    {
        super(c, props);
        if (typeof status !== "undefined")
        {
            this.status = status;
        }
    }
}