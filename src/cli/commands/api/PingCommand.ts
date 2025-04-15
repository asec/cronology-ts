import CliAction, {createCliCommand} from "../../../lib/cli/CliAction";
import PingAction from "../../../api/actions/ping/PingAction";

class PingCommand extends CliAction
{
    static
    {
        this.commandName = "action:get-ping";
        this.description = "Checks to see if the API can be reached. Also displays the current version.";
    }

    static createAction(): PingAction
    {
        return createCliCommand(PingAction);
    }
}

export default PingCommand;