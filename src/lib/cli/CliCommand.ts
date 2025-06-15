import fs from "fs";
import {Command} from "commander";
import AppConfig from "../../config/AppConfig.js";
import {EnvType} from "../config/Config.js";
import ConnectionPool from "../utils/ConnectionPool.js";
import ServiceContainer from "../service/ServiceContainer.js";
import CliMiddleware, {ErrorContext, InputContext, OutputContext} from "./CliMiddleware.js";
import {CliContext} from "../../cli/middleware/CliParamsParser.js";
import CronologyError from "../error/CronologyError.js";

interface MiddlewareContextType
{
    execute: CliContext,
    output: OutputContext,
    error: ErrorContext,
    input: InputContext
}

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

    protected registerCliParams(): void
    {}

    protected initialise(...args: unknown[]): void
    {}

    public use(middleware: CliMiddleware): CliCommand
    {
        this.middleware.push(middleware);
        return this;
    }

    private async dispatchMiddleware<K extends keyof MiddlewareContextType>(
        middlewareType: K,
        context: MiddlewareContextType[K],
        handler: () => Promise<void> | void
    ): Promise<void>
    {
        let index = -1;

        const dispatch = async (i: number): Promise<void> => {
            if (index >= i)
            {
                throw new CronologyError(
                    `Middleware error in '${this.constructor.name}'. Function 'next()' is possibly called ` +
                    `multiple times in '${middlewareType}'`
                );
            }

            index = i;
            const middleware = this.middleware[i];

            if (middleware)
            {
                switch (middlewareType)
                {
                    case "execute":
                        return middleware.execute(
                            this,
                            context as MiddlewareContextType["execute"],
                            () => dispatch(i + 1)
                        );
                    case "output":
                        return middleware.output(
                            context as MiddlewareContextType["output"],
                            () => dispatch(i + 1)
                        );
                    case "error":
                        return middleware.error(
                            context as MiddlewareContextType["error"],
                            () => dispatch(i + 1)
                        );
                    case "input":
                        return middleware.input(
                            context as MiddlewareContextType["input"],
                            () => dispatch(i + 1)
                        );
                    default:
                        throw new CronologyError(
                            `Middleware error in '${this.constructor.name}'. ` +
                            `Unknown middleware type '${middlewareType}'`
                        );
                }
            }

            return handler();
        };

        return dispatch(0);
    }

    public async execute(...args: unknown[])
    {
        const commander: Command = args[args.length - 1] as Command;
        const context: CliContext = new CliContext();
        context.bind({
            args: commander.args,
            options: commander.opts()
        });

        return this.dispatchMiddleware("execute", context, async () => {
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
        });
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

    protected async inputChar(): Promise<string>
    {
        const context: InputContext = {
            input: null
        };

        await this.dispatchMiddleware("input", context, () => {
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
            context.input = buffer.toString("utf8");
        });

        return context.input;
    }

    protected async output(output: any, extraLineBefore: boolean = true, extraLineAfter: boolean = true): Promise<void>
    {
        const context = {
            output,
            extraLineBefore,
            extraLineAfter
        };

        return this.dispatchMiddleware("output", context, () => {
            console.log(`${extraLineBefore ? "\n" : ""}[api-cli]`, output, extraLineAfter ? "\n" : "");
        });
    }

    protected async error(message: string): Promise<void>
    {
        const context = {
            message
        };

        return this.dispatchMiddleware("error", context, () => {
            this.program.error(message);
        });
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
