import CliApiAction from "../../../lib/cli/CliApiAction.js";
import ApiAction from "../../../lib/api/action/ApiAction.js";
import {ApiResponseContent} from "../../../lib/api/action/response/ApiResponse.js";
import {EmptyActionParamsContent} from "../../../lib/api/action/params/EmptyActionParams.js";
import TestErrorAction from "../../../api/actions/test-error/TestErrorAction.js";

export default class TestErrorCommand extends CliApiAction
{
    public commandName = "action:test-error";
    public description = "API action: GET /test-error";

    protected createAction(...args): Promise<ApiAction<ApiResponseContent, EmptyActionParamsContent>>
    {
        return this.createCliCommand(this.services.resolve(TestErrorAction));
    }
}