import CliApiAction from "../../../lib/cli/CliApiAction.js";
import TestErrorAction from "../../../api/actions/test-error/TestErrorAction.js";

export default class TestErrorCommand extends CliApiAction
{
    public commandName = "action:test-error";
    public description = "API action: GET /test-error";

    protected createAction(...args)
    {
        return this.createCliCommand(this.services.resolve(TestErrorAction));
    }
}