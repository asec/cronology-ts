import CliApiAction from "../../../lib/cli/CliApiAction";
import BadResponseAction from "../../../api/actions/bad-response/BadResponseAction";

export default class BadResponseCommand extends CliApiAction
{
    public commandName = "action:get-bad-response";
    public description = "API action: GET /bad-response";

    protected createAction(...args): Promise<BadResponseAction>
    {
        return this.createCliCommand(this.services.resolve(BadResponseAction));
    }
}