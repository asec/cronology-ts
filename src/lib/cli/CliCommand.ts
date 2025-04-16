import fs from "fs";
import Config from "../config/Config";
import {Command} from "commander";

type CliCommandArgument = {
    name: string,
    description?: string,
    defaultValue?: any
};

abstract class CliCommand
{
    public commandName: string;
    public description: string;
    public args: CliCommandArgument[] = [];
    public options: CliCommandArgument[] = [];

    public constructor(
        protected config: Config,
        protected program: Command,
        protected process: NodeJS.Process
    )
    {
        this.registerCliParams();
    }

    protected registerCliParams()
    {}

    protected initialise(...args)
    {
        this.config.setEnvironmentToCli();
    }

    public execute(...args)
    {
        try
        {
            this.initialise(...args);
            this.do(...args);
        }
        catch (e: unknown)
        {
            const error = <Error> e;
            this.error(`${error.name}: ${error.message}`);
        }
    }

    protected do(...args)
    {
        console.log(`API action called: ${this.commandName}`, args);
    }

    protected addArgument(name: string, description?: string, defaultValue?: any)
    {
        this.args.push({
            name,
            description,
            defaultValue
        });
    }

    protected addOption(name: string, description?: string, defaultValue?: any)
    {
        this.options.push({
            name,
            description,
            defaultValue
        });
    }

    protected inputChar(): string
    {
        this.process.stdin.setRawMode(true);
        let buffer = Buffer.alloc(1);
        let read = 0;
        do
        {
            try
            {
                read = fs.readSync(0, buffer, 0, 1, null);
            }
            catch (e)
            {
                if (e.code === "EAGAIN")
                {
                    continue;
                }
                throw e;
            }

        }
        while (read <= 0);
        return buffer.toString("utf8");
    }

    protected output(output: any, extraLineBefore: boolean = true, extraLineAfter: boolean = true)
    {
        console.log(`${extraLineBefore ? "\n" : ""}[api-cli]`, output, extraLineAfter ? "\n" : "");
    }

    protected error(message: string)
    {
        this.program.error(message);
    }
}

export {CliCommandArgument};
export default CliCommand;