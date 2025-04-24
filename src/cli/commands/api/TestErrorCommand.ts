import CliApiAction from "../../../lib/cli/CliApiAction";
import ApiAction from "../../../lib/api/action/ApiAction";
import {ApiResponseContent} from "../../../lib/api/action/response/ApiResponse";
import {EmptyActionParamsContent} from "../../../lib/api/action/params/EmptyActionParams";
import TestErrorAction from "../../../api/actions/test-error/TestErrorAction";

export default class TestErrorCommand extends CliApiAction
{
    public commandName = "action:test-error";
    public description = "API action: GET /test-error";

    protected createAction(...args): Promise<ApiAction<ApiResponseContent, EmptyActionParamsContent>>
    {
        return this.createCliCommand(this.services.resolve(TestErrorAction));
    }
}