import ApiResponse, {ApiResponseContent} from "../../../../lib/api/action/response/ApiResponse";
import {HttpStatus} from "../../../../lib/api/Http";

class WaitActionResponseContent extends ApiResponseContent
{
    public waited: number = undefined;
}

class WaitActionResponse extends ApiResponse<WaitActionResponseContent>
{
    constructor(props?: WaitActionResponseContent, status?: HttpStatus)
    {
        super(WaitActionResponseContent, props, status);
    }
}

export {WaitActionResponseContent};
export default WaitActionResponse;