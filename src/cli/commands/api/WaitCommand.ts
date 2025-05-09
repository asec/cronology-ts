import CliApiAction from "../../../lib/cli/CliApiAction.js";
import WaitAction from "../../../api/actions/wait/WaitAction.js";

export default class WaitCommand extends CliApiAction
{
    public commandName = "action:get-wait";
    public description = "Wait for a specified amount of time then send a successful response."

    protected createAction(...args)
    {
        return this.createCliCommand(this.services.resolve(WaitAction));
    }
}