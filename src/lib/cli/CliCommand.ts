import fs from "fs";
import {Command} from "commander";
import AppConfig from "../../config/AppConfig";
import {EnvType} from "../config/Config";
import ServiceContainer from "../service/ServiceContainer";
import IDatabase from "../database/IDatabase";

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
        protected config: AppConfig,
        protected program: Command,
        protected process: NodeJS.Process,
        protected services: ServiceContainer
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

    public async execute(...args)
    {
        try
        {
            this.initialise(...args);
            await this.do(...args);
        }
        catch (e: unknown)
        {
            const error = <Error> e;
            let errorMsg = `${error.name}: ${error.message}`;
            if (!this.config.isCurrentEnv(EnvType.Prod))
            {
                errorMsg += `\n${error.stack}`;
            }
            this.error(errorMsg);
        }

        try
        {
            await (<IDatabase<any>> this.services.resolve(Symbol("IDatabase"))).destruct();
        }
        catch (e: unknown)
        {
            const error = <Error> e;
            let errorMsg = `${error.name}: ${error.message}`;
            if (!this.config.isCurrentEnv(EnvType.Prod))
            {
                errorMsg += `\n${error.stack}`;
            }
            this.error(errorMsg);
        }
    }

    protected async do(...args)
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