import CliCommand from "../../lib/cli/CliCommand";

class EnvGetCommand extends CliCommand
{
    public commandName = "cli-env-get";
    public description = "Tells you which environment the CLI is currently set to.";

    protected async do()
    {
        this.output(`The current CLI environment is \x1b[32m${this.config.get("APP_ENV")}\x1b[0m.`);
    }
}

export default EnvGetCommand;