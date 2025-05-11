import {ServiceRegistrar} from "./index.js";
import EnvGetCommand from "../cli/commands/EnvGetCommand.js";
import AppConfig from "../config/AppConfig.js";
import ServiceContainer from "../lib/service/ServiceContainer.js";
import EnvSetCommand from "../cli/commands/EnvSetCommand.js";
import ServerStartCommand from "../cli/commands/ServerStartCommand.js";

const registerServicesCliCommands: ServiceRegistrar = (services, interfaces) => {
    const {IProgram, IProcess, IServer} = interfaces;

    services.register(EnvGetCommand, () => {
        return new EnvGetCommand(
            services.resolve(AppConfig),
            services.resolve(IProgram),
            services.resolve(IProcess),
            services.resolve(ServiceContainer)
        );
    });

    services.register(EnvSetCommand, () => {
        return new EnvSetCommand(
            services.resolve(AppConfig),
            services.resolve(IProgram),
            services.resolve(IProcess),
            services.resolve(ServiceContainer)
        );
    });

    services.register(ServerStartCommand, () => {
        return new ServerStartCommand(
            services.resolve(AppConfig),
            services.resolve(IProgram),
            services.resolve(IProcess),
            services.resolve(IServer),
            services.resolve(ServiceContainer)
        );
    });
};

export default registerServicesCliCommands;