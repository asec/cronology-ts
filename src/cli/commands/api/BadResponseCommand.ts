import CliApiAction from "../../../lib/cli/CliApiAction.js";
import BadResponseAction from "../../../api/actions/bad-response/BadResponseAction.js";

export default class BadResponseCommand extends CliApiAction
{
    public commandName = "action:get-bad-response";
    public description = "API action: GET /bad-response";

    protected createAction(...args)
    {
        return this.createCliCommand(this.services.resolve(BadResponseAction));
    }
}