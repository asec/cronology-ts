import {ServiceRegistrar} from "./index.js";
import Cli from "../lib/cli/Cli.js";
import {CliDependencies} from "../lib/cli/CliCommand.js";
import {ServiceBindings} from "../lib/service/ServiceContainer.js";

export interface ServiceBindingsCli extends ServiceBindings
{
    "cli": () => Cli,
    "cli.dependencies": () => CliDependencies
}

const registerServicesCliBasics: ServiceRegistrar = (services) => {

    services.register("cli", () => {
        return new Cli(
            services.resolve("program"),
            services.resolve("packageInfo")
        );
    });

    services.register("cli.dependencies", (): CliDependencies => {
        return {
            config: services.resolve("config"),
            program: services.resolve("program"),
            process: services.resolve("process"),
            services: services.resolve("services"),
            connectionPool: services.resolve("connectionPool")
        };
    });
};

export default registerServicesCliBasics;