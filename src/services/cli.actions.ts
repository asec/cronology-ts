import {ServiceRegistrar} from "./index.js";
import PingCommand from "../cli/commands/api/PingCommand.js";
import BadResponseCommand from "../cli/commands/api/BadResponseCommand.js";
import TestErrorCommand from "../cli/commands/api/TestErrorCommand.js";
import WaitCommand from "../cli/commands/api/WaitCommand.js";

const registerServicesCliActions: ServiceRegistrar = (services, interfaces) => {
    const {IProgram, IProcess, CliDependencies} = interfaces;

    services.register(PingCommand, () => {
        return new PingCommand(
            services.resolve(CliDependencies)
        );
    });

    services.register(BadResponseCommand, () => {
        return new BadResponseCommand(
            services.resolve(CliDependencies)
        );
    });

    services.register(TestErrorCommand, () => {
        return new TestErrorCommand(
            services.resolve(CliDependencies)
        );
    });

    services.register(WaitCommand, () => {
        return new WaitCommand(
            services.resolve(CliDependencies)
        );
    });
};

export default registerServicesCliActions;