import {ServiceRegistrar} from "./index.js";
import Cli from "../lib/cli/Cli.js";
import PackageInfo from "../lib/utils/PackageInfo.js";
import {CliDependencies} from "../lib/cli/CliCommand.js";
import AppConfig from "../config/AppConfig.js";
import ServiceContainer from "../lib/service/ServiceContainer.js";
import ConnectionPool from "../lib/utils/ConnectionPool.js";

const registerServicesCliBasics: ServiceRegistrar = (services, interfaces) => {
    const {IProgram, CliDependencies, IProcess} = interfaces;

    services.register(Cli, () => {
        return new Cli(
            services.resolve(IProgram),
            services.resolve(PackageInfo)
        );
    });

    services.register(CliDependencies, (): CliDependencies => {
        return {
            config: services.resolve(AppConfig),
            program: services.resolve(IProgram),
            process: services.resolve(IProcess),
            services: services.resolve(ServiceContainer),
            connectionPool: services.resolve(ConnectionPool)
        };
    });
};

export default registerServicesCliBasics;