import Bean, {BeanContents} from "../../../datastructures/Bean";
import {HttpStatus} from "../../Http";

class ApiResponseContent extends BeanContents
{
    public success: boolean = undefined;
}

class ApiResponse<TResponseContent extends ApiResponseContent> extends Bean<TResponseContent>
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

export {ApiResponseContent}
export default ApiResponse;