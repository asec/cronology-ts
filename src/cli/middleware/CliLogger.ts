import CliMiddleware, {
    CliMiddlewareNextFunction,
    ErrorContext,
    InputContext,
    OutputContext
} from "../../lib/cli/CliMiddleware.js";
import CliCommand from "../../lib/cli/CliCommand.js";
import ILogger from "../../lib/logger/ILogger.js";
import {Uuid} from "../../lib/utils/Uuid.js";
import {CliContext} from "./CliParamsParser.js";

export default class CliLogger extends CliMiddleware
{
    public constructor(
        protected logger: ILogger,
        uuidGenerator: Uuid
    )
    {
        super(uuidGenerator);
    }

    public async execute(command: CliCommand, context: CliContext, next: CliMiddlewareNextFunction): Promise<void>
    {
        await this.logger.info(`Executing command: ${command.commandName}`, {
            id: this.commandId,
            args: context.args,
            options: context.options
        });
        await next();
        await this.logger.info("Finished command", {id: this.commandId});
    }

    public async output(context: OutputContext, next: CliMiddlewareNextFunction): Promise<void>
    {
        await this.logger.info("Output", {
            id: this.commandId,
            ...context
        });
        await next();
    }

    public async error(context: ErrorContext, next: CliMiddlewareNextFunction): Promise<void>
    {
        await this.logger.error("Error", {
            id: this.commandId,
            ...context
        });
        await next();
    }

    public async input(context: InputContext, next: CliMiddlewareNextFunction): Promise<void>
    {
        await next();
        await this.logger.info("Input", context);
    }
}