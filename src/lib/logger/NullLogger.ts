import ILogger, {LogContext, LogLevel} from "./ILogger.js";

export default class NullLogger implements ILogger
{
    public async debug(message: string, context?: LogContext): Promise<void>
    {}

    public async error(message: string, context?: LogContext): Promise<void>
    {}

    public async info(message: string, context?: LogContext): Promise<void>
    {}

    public async log(level: LogLevel, message: string, context?: LogContext): Promise<void>
    {}

    public async warning(message: string, context?: LogContext): Promise<void>
    {}
}