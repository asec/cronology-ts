import {Command} from "commander";

export function cliContext(args: string[] = [], opts: Record<string, any> = {})
{
    const context: Partial<Command> = {
        args,
        opts: <T extends Record<string, any>>() => (opts as T)
    };

    return [...context.args, context.opts(), context];
}