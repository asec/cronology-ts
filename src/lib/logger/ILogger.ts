export type LogLevel = "info" | "debug" | "warning" | "error";
export type LogContext = Record<string, any>;

export default interface ILogger
{
    log(level: LogLevel, message: string, context?: LogContext): Promise<void>;
    info(message: string, context?: LogContext): Promise<void>;
    debug(message: string, context?: LogContext): Promise<void>;
    warning(message: string, context?: LogContext): Promise<void>;
    error(message: string, context?: LogContext): Promise<void>;
}