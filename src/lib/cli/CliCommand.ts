import fs from "fs";
import Config from "../config/Config";
import {program} from "commander";

type CliCommandArgument = {
    name: string,
    description?: string,
    defaultValue?: any
};

class CliCommand
{
    public static commandName: string;
    public static description: string;
    public static args: CliCommandArgument[];
    public static options: CliCommandArgument[];

    public static doWithInitialization(...args)
    {
        Config.setEnvironmentToCli();
        this.do(...args);
    }

    protected static do(...args)
    {
        console.log(`API action called: ${this.commandName}`, args);
    }

    protected static addArgument(name: string, description?: string, defaultValue?: any)
    {
        if (typeof this.args === "undefined")
        {
            this.args = [];
        }

        this.args.push({
            name,
            description,
            defaultValue
        });
    }

    protected static addOption(name: string, description?: string, defaultValue?: any)
    {
        if (typeof this.options === "undefined")
        {
            this.options = [];
        }

        this.options.push({
            name,
            description,
            defaultValue
        });
    }

    protected static inputChar(): string
    {
        process.stdin.setRawMode(true);
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

    protected static output(output: any, extraLineBefore: boolean = true, extraLineAfter: boolean = true)
    {
        console.log(`${extraLineBefore ? "\n" : ""}[api-cli]`, output, extraLineAfter ? "\n" : "");
    }

    protected static error(message: string)
    {
        program.error(message);
    }
}

export {CliCommandArgument};
export default CliCommand;