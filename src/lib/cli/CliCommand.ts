import fs from "fs";
import {Command} from "commander";
import AppConfig from "../../config/AppConfig.js";
import {EnvType} from "../config/Config.js";
import ConnectionPool from "../utils/ConnectionPool.js";
import ServiceContainer from "../service/ServiceContainer.js";
import CliMiddleware from "./CliMiddleware.js";
import {CliContext} from "../../cli/middleware/CliParamsParser.js";
import CronologyError from "../error/CronologyError.js";

export type CliCommandArgument = {
    name: string,
    description?: string,
    defaultValue?: any
};

export interface CliDependencies
{
    config: AppConfig,
    program: Command,
    process: NodeJS.Process,
    services: ServiceContainer,
    connectionPool: ConnectionPool
}

export default abstract class CliCommand
{
    public commandName: string;
    public description: string;
    public args: CliCommandArgument[] = [];
    public options: CliCommandArgument[] = [];

    protected config: AppConfig;
    protected program: Command;
    protected process: NodeJS.Process;
    protected services: ServiceContainer;
    protected connectionPool: ConnectionPool;

    protected middleware: CliMiddleware[] = [];

    public constructor(dependencies: CliDependencies)
    {
        this.config = dependencies.config;
        this.program = dependencies.program;
        this.process = dependencies.process;
        this.services = dependencies.services;
        this.connectionPool = dependencies.connectionPool;
        this.registerCliParams();
    }

    protected registerCliParams()
    {}

    protected initialise(...args: unknown[])
    {}

    public use(middleware: CliMiddleware): CliCommand
    {
        this.middleware.push(middleware);
        return this;
    }

    public async execute(...args: unknown[])
    {
        const commander: Command = args[args.length - 1] as Command;
        const context: CliContext = new CliContext();
        context.bind({
            args: commander.args,
            options: commander.opts()
        });

        let index = -1;
        const dispatch = async (i: number) => {
            if (index >= i)
            {
                throw new CronologyError(
                    `Middleware error in '${this.constructor.name}'. Function 'next()' is possibly called ` +
                    `multiple times in 'execute'`
                );
            }
            index = i;
            const middleware = this.middleware[i];
            if (middleware)
            {
                return middleware.execute(this, context, () => dispatch(i + 1));
            }

            return (async () => {
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
                    await this.error(errorMsg);
                }

                try
                {
                    await this.connectionPool.release();
                }
                catch (e: unknown)
                {
                    const error = <Error> e;
                    let errorMsg = `${error.name}: ${error.message}`;
                    if (!this.config.isCurrentEnv(EnvType.Prod))
                    {
                        errorMsg += `\n${error.stack}`;
                    }
                    await this.error(errorMsg);
                }
            })();
        };

        return dispatch(0);
    }

    protected async do(...args: unknown[])
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

    protected async output(output: any, extraLineBefore: boolean = true, extraLineAfter: boolean = true): Promise<void>
    {
        let index = -1;
        const dispatch = async (i: number) => {
            if (index >= i)
            {
                throw new CronologyError(
                    `Middleware error in '${this.constructor.name}'. Function 'next()' is possibly called ` +
                    `multiple times in 'output'`
                );
            }
            index = i;
            const middleware = this.middleware[i];
            if (middleware)
            {
                return middleware.output({
                    output,
                    extraLineBefore,
                    extraLineAfter
                }, () => dispatch(i + 1));
            }

            return (() => {
                console.log(`${extraLineBefore ? "\n" : ""}[api-cli]`, output, extraLineAfter ? "\n" : "");
            })();
        };

        return dispatch(0);
    }

    protected async error(message: string): Promise<void>
    {
        const dispatch = async (i: number) => {
            const middleware = this.middleware[i];
            if (middleware)
            {
                return middleware.error({
                    message
                }, () => dispatch(i + 1));
            }

            return (() => {
                this.program.error(message);
            })();
        };

        return dispatch(0);
    }

    protected red(message: string): string
    {
        return `\x1b[31m${message}\x1b[0m`;
    }

    protected green(message: string): string
    {
        return `\x1b[32m${message}\x1b[0m`;
    }
}