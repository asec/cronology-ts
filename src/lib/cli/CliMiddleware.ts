import CliCommand from "./CliCommand.js";
import {CliContext} from "../../cli/middleware/CliParamsParser.js";
import {Uuid} from "../utils/Uuid.js";

export type CliMiddlewareNextFunction = () => Promise<void> | void;

export interface OutputContext
{
    output: any,
    extraLineBefore: boolean,
    extraLineAfter: boolean
}

export interface ErrorContext
{
    message: string
}

export interface InputContext
{
    input: string
}

export default abstract class CliMiddleware
{
    protected commandId: string;

    protected constructor(uuidGenerator: Uuid)
    {
        this.commandId = uuidGenerator();
    }

    public abstract execute(command: CliCommand, context: CliContext, next: CliMiddlewareNextFunction): Promise<void> | void;
    public abstract output(context: OutputContext, next: CliMiddlewareNextFunction): Promise<void> | void;
    public abstract error(context: ErrorContext, next: CliMiddlewareNextFunction): Promise<void> | void;
    public abstract input(context: InputContext, next: CliMiddlewareNextFunction): Promise<void> | void;
}