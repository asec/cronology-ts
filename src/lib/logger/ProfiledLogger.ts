import ILogger, {LogContext, LogLevel} from "./ILogger.js";
import Profiler from "../utils/Profiler.js";

export default class ProfiledLogger implements ILogger
{
    public constructor(
        protected logger: ILogger,
        protected profiler: Profiler
    )
    {}

    public async info(message: string, context?: LogContext): Promise<void>
    {
        return this.log("info", message, context);
    }

    public async debug(message: string, context?: LogContext): Promise<void>
    {
        return this.log("debug", message, context);
    }

    public async error(message: string, context?: LogContext): Promise<void>
    {
        return this.log("error", message, context);
    }

    public async warning(message: string, context?: LogContext): Promise<void>
    {
        return this.log("warning", message, context);
    }

    public async log(level: LogLevel, message: string, context?: LogContext): Promise<void>
    {
        context = context || {};
        context["rt"] = this.profiler.mark();
        return this.logger.log(level, message, context);
    }
}