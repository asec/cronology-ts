import CliCommand from "./CliCommand";
import {Command, program} from "commander";

class Cli
{
    public constructor(
        private program: Command
    )
    {}

    public addCommand(command: CliCommand)
    {
        const cmd = program.command(command.commandName);
        cmd.description(command.description);
        command.args.forEach(arg => {
            cmd.argument(arg.name, arg.description, arg.defaultValue);
        });
        command.options.forEach(option => {
            cmd.option(option.name, option.description, option.defaultValue);
        });

        cmd.action(command.execute.bind(command));
    }

    public init(commands: CliCommand[])
    {
        const packageInfo = require("../../../package.json");

        this.program
            .description("CLI tools for the Cronology API.")
            .version(packageInfo.version, "-v, --version")
            .configureOutput({
                writeErr: str => process.stderr.write(`\x1b[31m[api-console][error] ${str}\x1b[0m`)
            })
        ;

        commands.forEach(command => {
            this.addCommand(command);
        });
    }

    public start()
    {
        this.program.parse();
    }
}

export default Cli;