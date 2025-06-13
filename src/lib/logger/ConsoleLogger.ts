import ILogger, {LogContext, LogLevel} from "./ILogger.js";

export default class ConsoleLogger implements ILogger
{
    public constructor(
        protected prefix: string = ""
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
        message = `${this.prefix ? `[${this.prefix}] ` : ""}${message}`;
        switch (level)
        {
            case "info":
                console.info(this.now(), message, context || "");
                break;
            case "debug":
                console.debug(this.now(), message, context || "");
                break;
            case "error":
                console.debug(this.now(), message, context || "");
                break;
            case "warning":
                console.warn(this.now(), message, context || "");
                break;
            default:
                console.log(this.now(), message, context || "");
        }
    }

    protected now(): string
    {
        const date = new Date();
        const str = date.toISOString().split(".").shift().replace("T", " ");
        const offset = date.getTimezoneOffset() * -1 / 60;
        return `${str} GMT${offset >= 0 ? "+" : ""}${offset}`;
    }
}