import CliAction, {createCliCommand} from "../../../lib/cli/CliAction";
import WaitAction from "../../../api/actions/wait/WaitAction";
import WaitActionParams from "../../../api/actions/wait/params/WaitActionParams";
import {BeanProps} from "../../../lib/datastructures/Bean";

interface WaitCommandOptions extends BeanProps
{
    ms: string,
}

class WaitCommand extends CliAction
{
    static
    {
        this.commandName = "action:get-wait";
        this.description = "Wait for a specified amount of time then send a successful response.";

        this.addOption(
            "-m, --ms <milliseconds>",
            "Time to wait in milliseconds. Must be an integer between 0 and 30000. Default: 1000.",
            1000
        );
    }

    static createAction(options: WaitCommandOptions): WaitAction
    {
        return createCliCommand(WaitAction, WaitActionParams, options);
    }
}

export default WaitCommand;