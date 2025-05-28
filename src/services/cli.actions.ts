import {ServiceRegistrar} from "./index.js";
import PingCommand from "../cli/commands/api/PingCommand.js";
import BadResponseCommand from "../cli/commands/api/BadResponseCommand.js";
import TestErrorCommand from "../cli/commands/api/TestErrorCommand.js";
import WaitCommand from "../cli/commands/api/WaitCommand.js";
import {ServiceBindings} from "../lib/service/ServiceContainer.js";

export interface ServiceBindingsCliActions extends ServiceBindings
{
    "cli.action.ping": () => PingCommand,
    "cli.action.badResponse": () => BadResponseCommand,
    "cli.action.testError": () => TestErrorCommand,
    "cli.action.wait": () => WaitCommand
}

const registerServicesCliActions: ServiceRegistrar = (services) => {

    services.register("cli.action.ping", () => {
        return new PingCommand(
            services.resolve("cli.dependencies")
        );
    });

    services.register("cli.action.badResponse", () => {
        return new BadResponseCommand(
            services.resolve("cli.dependencies")
        );
    });

    services.register("cli.action.testError", () => {
        return new TestErrorCommand(
            services.resolve("cli.dependencies")
        );
    });

    services.register("cli.action.wait", () => {
        return new WaitCommand(
            services.resolve("cli.dependencies")
        );
    });
};

export default registerServicesCliActions;