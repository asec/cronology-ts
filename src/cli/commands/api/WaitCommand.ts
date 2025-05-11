import CliApiAction from "../../../lib/cli/CliApiAction.js";
import WaitAction from "../../../api/actions/wait/WaitAction.js";
import WaitActionParamsParserCli from "../../../api/actions/wait/params/WaitActionParamsParserCli.js";

export default class WaitCommand extends CliApiAction
{
    public commandName = "action:get-wait";
    public description = "Wait for a specified amount of time then send a successful response."

    protected registerCliParams()
    {
        this.addOption(
            "-m, --ms <milliseconds>",
            "Time to wait in milliseconds. Must be an integer between 0 and 30000. Default: 1000.",
            1000
        );
    }

    protected createAction(...args)
    {
        return this.createCliCommand(
            this.services.resolve(WaitAction)
                .use(new WaitActionParamsParserCli())
        );
    }
}