import CliApiAction from "../../../lib/cli/CliApiAction";
import WaitAction from "../../../api/actions/wait/WaitAction";
import WaitActionParams from "../../../api/actions/wait/params/WaitActionParams";
import {BeanProps} from "../../../lib/datastructures/Bean";

interface WaitCommandOptions extends BeanProps
{
    ms: string,
}

export default class WaitCommand extends CliApiAction
{
    public commandName = "action:get-wait";
    public description = "Wait for a specified amount of time then send a successful response.";

    protected registerCliParams()
    {
        this.addOption(
            "-m, --ms <milliseconds>",
            "Time to wait in milliseconds. Must be an integer between 0 and 30000. Default: 1000.",
            1000
        );
    }

    protected createAction(options: WaitCommandOptions)
    {
        return this.createCliCommand(this.services.resolve(WaitAction), new WaitActionParams(), options);
    }
}