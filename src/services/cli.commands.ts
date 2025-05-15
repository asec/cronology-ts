import {ServiceRegistrar} from "./index.js";
import EnvGetCommand from "../cli/commands/EnvGetCommand.js";
import EnvSetCommand from "../cli/commands/EnvSetCommand.js";
import ServerStartCommand from "../cli/commands/ServerStartCommand.js";
import AppCreateCommand from "../cli/commands/AppCreateCommand.js";
import ApplicationFactory from "../entities/factory/ApplicationFactory.js";
import ValidatorFactory from "../lib/validation/ValidatorFactory.js";

const registerServicesCliCommands: ServiceRegistrar = (services, interfaces) => {
    const {IServer, CliDependencies} = interfaces;

    services.register(EnvGetCommand, () => {
        return new EnvGetCommand(
            services.resolve(CliDependencies)
        );
    });

    services.register(EnvSetCommand, () => {
        return new EnvSetCommand(
            services.resolve(CliDependencies)
        );
    });

    services.register(ServerStartCommand, () => {
        return new ServerStartCommand(
            services.resolve(CliDependencies),
            services.resolve(IServer)
        );
    });

    services.register(AppCreateCommand, () => {
        return new AppCreateCommand(
            services.resolve(CliDependencies),
            services.resolve(ApplicationFactory),
            services.resolve(ValidatorFactory)
        );
    });
};

export default registerServicesCliCommands;