import CliCommand from "../../lib/cli/CliCommand";

class EnvGetCommand extends CliCommand
{
    static
    {
        this.commandName = "cli-env-get";
        this.description = "Tells you which environment the CLI is currently set to."
    }

    protected static do()
    {
        this.output(`The current CLI environment is \x1b[32m${process.env.APP_ENV}\x1b[0m.`);
    }
}

export default EnvGetCommand;