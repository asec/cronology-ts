import {ServiceRegistrar} from "./index.js";
import PingCommand from "../cli/commands/api/PingCommand.js";
import BadResponseCommand from "../cli/commands/api/BadResponseCommand.js";
import TestErrorCommand from "../cli/commands/api/TestErrorCommand.js";
import WaitCommand from "../cli/commands/api/WaitCommand.js";
import {ServiceBindings} from "../lib/service/ServiceContainer.js";
import CliCommand from "../lib/cli/CliCommand.js";

export interface ServiceBindingsCliActions extends ServiceBindings
{
    "cli.action.ping": () => PingCommand,
    "cli.action.badResponse": () => BadResponseCommand,
    "cli.action.testError": () => TestErrorCommand,
    "cli.action.wait": () => WaitCommand
}

const registerServicesCliActions: ServiceRegistrar = (services) => {

    function registerMiddleware<TCommand extends CliCommand>(command: TCommand): TCommand
    {
        command.use(services.resolve("cli.command.middleware.logger"));

        return command;
    }

    services.register("cli.action.ping", () => {
        return registerMiddleware(new PingCommand(
            services.resolve("cli.dependencies")
        ));
    });

    services.register("cli.action.badResponse", () => {
        return registerMiddleware(new BadResponseCommand(
            services.resolve("cli.dependencies")
        ));
    });

    services.register("cli.action.testError", () => {
        return registerMiddleware(new TestErrorCommand(
            services.resolve("cli.dependencies")
        ));
    });

    services.register("cli.action.wait", () => {
        return registerMiddleware(new WaitCommand(
            services.resolve("cli.dependencies")
        ));
    });
};

export default registerServicesCliActions;