import CliCommand from "./CliCommand";
import {program} from "commander";

class Cli
{
    public static addCommand(command: typeof CliCommand)
    {
        const cmd = program.command(command.commandName);
        cmd.description(command.description);
        if (typeof command.args !== "undefined")
        {
            command.args.forEach(arg => {
                cmd.argument(arg.name, arg.description, arg.defaultValue);
            });
        }
        if (typeof command.options !== "undefined")
        {
            command.options.forEach(option => {
                cmd.option(option.name, option.description, option.defaultValue);
            });
        }

        cmd.action(command.doWithInitialization.bind(command));
    }

    public static init()
    {
        const packageInfo = require("../../../package.json");

        program
            .description("CLI tools for the Cronology API.")
            .version(packageInfo.version, "-v, --version")
            .configureOutput({
                writeErr: str => process.stderr.write(`\x1b[31m[api-console][error] ${str}\x1b[0m`)
            })
        ;

        const commands: typeof CliCommand[] = require("../../cli/commands");

        commands.forEach(command => {
            this.addCommand(command);
        });

        program.parse();
    }
}

export default Cli;