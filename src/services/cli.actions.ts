import {ServiceRegistrar} from "./index.js";
import PingCommand from "../cli/commands/api/PingCommand.js";
import AppConfig from "../config/AppConfig.js";
import ServiceContainer from "../lib/service/ServiceContainer.js";
import BadResponseCommand from "../cli/commands/api/BadResponseCommand.js";
import TestErrorCommand from "../cli/commands/api/TestErrorCommand.js";
import WaitCommand from "../cli/commands/api/WaitCommand.js";

const registerServicesCliActions: ServiceRegistrar = (services, interfaces) => {
    const {IProgram, IProcess, IServer} = interfaces;

    services.register(PingCommand, () => {
        return new PingCommand(
            services.resolve(AppConfig),
            services.resolve(IProgram),
            services.resolve(IProcess),
            services.resolve(ServiceContainer)
        );
    });

    services.register(BadResponseCommand, () => {
        return new BadResponseCommand(
            services.resolve(AppConfig),
            services.resolve(IProgram),
            services.resolve(IProcess),
            services.resolve(ServiceContainer)
        );
    });

    services.register(TestErrorCommand, () => {
        return new TestErrorCommand(
            services.resolve(AppConfig),
            services.resolve(IProgram),
            services.resolve(IProcess),
            services.resolve(ServiceContainer)
        );
    });

    services.register(WaitCommand, () => {
        return new WaitCommand(
            services.resolve(AppConfig),
            services.resolve(IProgram),
            services.resolve(IProcess),
            services.resolve(ServiceContainer)
        );
    });
};

export default registerServicesCliActions;