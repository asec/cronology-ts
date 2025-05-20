import {ServiceRegistrar} from "./index.js";
import EnvGetCommand from "../cli/commands/EnvGetCommand.js";
import EnvSetCommand from "../cli/commands/EnvSetCommand.js";
import ServerStartCommand from "../cli/commands/ServerStartCommand.js";
import AppCreateCommand from "../cli/commands/AppCreateCommand.js";
import {ServiceBindings} from "../lib/service/ServiceContainer.js";

export interface ServiceBindingsCliCommands extends ServiceBindings
{
    "cli.command.env-get": () => EnvGetCommand,
    "cli.command.env-set": () => EnvSetCommand,
    "cli.command.server-start": () => ServerStartCommand,
    "cli.command.app-create": () => AppCreateCommand
}

const registerServicesCliCommands: ServiceRegistrar = (services) => {

    services.register("cli.command.env-get", () => {
        return new EnvGetCommand(
            services.resolve("cli.dependencies")
        );
    });

    services.register("cli.command.env-set", () => {
        return new EnvSetCommand(
            services.resolve("cli.dependencies")
        );
    });

    services.register("cli.command.server-start", () => {
        return new ServerStartCommand(
            services.resolve("cli.dependencies"),
            services.resolve("server")
        );
    });

    services.register("cli.command.app-create", () => {
        return new AppCreateCommand(
            services.resolve("cli.dependencies"),
            services.resolve("factory.application"),
            services.resolve("validators")
        );
    });
};

export default registerServicesCliCommands;