import CliCommand from "./CliCommand.js";
import {Command, program} from "commander";
import PackageInfo from "../utils/PackageInfo.js";
import ILogger, {LogLevel} from "../logger/ILogger.js";

export default class Cli
{
    public constructor(
        private program: Command,
        private packageInfo: PackageInfo,
        private logger: ILogger
    )
    {}

    public async addCommand(command: CliCommand)
    {
        await this.logger.debug(`Registering command '${command.commandName}'`);

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

    public async init(commands: CliCommand[])
    {
        const version: string = await this.packageInfo.get("version") as string;

        this.program
            .description("CLI tools for the Cronology API.")
            .version(version, "-v, --version")
            .configureOutput({
                writeErr: str => process.stderr.write(`\x1b[31m[api-cli][error] ${str}\x1b[0m`)
            })
        ;

        for (let i = 0; i < commands.length; i++)
        {
            const command = commands[i];
            await this.addCommand(command);
        }
    }

    public async start()
    {
        await this.logger.info("Starting CLI");

        this.program.parse();
    }
}