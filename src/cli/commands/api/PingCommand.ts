import CliApiAction from "../../../lib/cli/CliApiAction.js";

class PingCommand extends CliApiAction
{
    public commandName: string = "action:get-ping";
    public description: string = "Checks to see if the API can be reached. Also displays the current version.";

    protected createAction(...args)
    {
        return this.createCliCommand(this.services.resolve("api.action.ping"));
    }
}

export default PingCommand;