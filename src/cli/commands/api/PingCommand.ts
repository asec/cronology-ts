import CliApiAction from "../../../lib/cli/CliApiAction.js";
import PingAction from "../../../api/actions/ping/PingAction.js";

class PingCommand extends CliApiAction
{
    public commandName: string = "action:get-ping";
    public description: string = "Checks to see if the API can be reached. Also displays the current version.";

    protected createAction(...args)
    {
        return this.createCliCommand(this.services.resolve(PingAction));
    }
}

export default PingCommand;