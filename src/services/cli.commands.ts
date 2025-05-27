import {ServiceRegistrar} from "./index.js";
import EnvGetCommand from "../cli/commands/EnvGetCommand.js";
import EnvSetCommand from "../cli/commands/EnvSetCommand.js";
import ServerStartCommand from "../cli/commands/ServerStartCommand.js";
import AppCreateCommand from "../cli/commands/AppCreateCommand.js";
import {ServiceBindings} from "../lib/service/ServiceContainer.js";
import AppKeysCommand from "../cli/commands/AppKeysCommand.js";
import AppIpCommand from "../cli/commands/AppIpCommand.js";
import AppDeleteCommand from "../cli/commands/AppDeleteCommand.js";

export interface ServiceBindingsCliCommands extends ServiceBindings
{
    "cli.command.env-get": () => EnvGetCommand,
    "cli.command.env-set": () => EnvSetCommand,
    "cli.command.server-start": () => ServerStartCommand,
    "cli.command.app-create": () => AppCreateCommand,
    "cli.command.app-keys": () => AppKeysCommand,
    "cli.command.app-ip": () => AppIpCommand,
    "cli.command.app-delete": () => AppDeleteCommand
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

    services.register("cli.command.app-keys", () => {
        return new AppKeysCommand(
            services.resolve("cli.dependencies"),
            services.resolve("factory.application")
        );
    });

    services.register("cli.command.app-ip", () => {
        return new AppIpCommand(
            services.resolve("cli.dependencies"),
            services.resolve("factory.application"),
            services.resolve("validators")
        );
    });

    services.register("cli.command.app-delete", () => {
        return new AppDeleteCommand(
            services.resolve("cli.dependencies"),
            services.resolve("factory.application")
        );
    });
};

export default registerServicesCliCommands;