import ILogger, {LogContext, LogLevel} from "./ILogger.js";
import fs from "fs";
import path from "path";

export default class FileLogger implements ILogger
{
    protected fileName: string;

    public constructor(
        protected pathGenerator: () => string,
        protected prefix: string = ""
    )
    {
        const date = new Date();
        this.fileName = date.toISOString().split("T").shift() + ".log";
    }

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
        const path = await this.handlePath();
        const data = [
            this.now(),
            level,
            `${this.prefix ? `[${this.prefix}] ` : ""}${message}`,
            context ? JSON.stringify(context) : ""
        ];

        await fs.promises.appendFile(path + "/" + this.fileName, data.join("\t") + "\n", {
            mode: 644,
            encoding: "utf-8"
        });
    }

    protected async handlePath(): Promise<string>
    {
        const fullPath = path.resolve(
            this.pathGenerator() +
            (this.prefix ? `/${this.prefix.replace(".", "-")}` : "")
        );
        try
        {
            await fs.promises.access(fullPath, fs.constants.R_OK | fs.constants.W_OK);
        }
        catch
        {
            await fs.promises.mkdir(fullPath, {
                mode: 644,
                recursive: true
            });
        }

        return fullPath;
    }

    protected now(): string
    {
        const date = new Date();
        const str = date.toISOString().split(".").shift().replace("T", " ");
        const offset = date.getTimezoneOffset() * -1 / 60;
        return `${str} GMT${offset >= 0 ? "+" : ""}${offset}`;
    }
}