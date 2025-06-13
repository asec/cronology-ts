import {ServiceBindings} from "../lib/service/ServiceContainer.js";
import CliLogger from "../cli/middleware/CliLogger.js";
import services, {ServiceRegistrar} from "./index.js";

export interface ServiceBindingsCliCommandsMiddleware extends ServiceBindings
{
    "cli.command.middleware.logger": () => CliLogger
}

const registerServicesCliCommandsMiddleware: ServiceRegistrar = (services) => {

    services.register("cli.command.middleware.logger", () => {
        return new CliLogger(
            services.resolve("logger.cli"),
            services.resolve("uuid")
        );
    });
};

export default registerServicesCliCommandsMiddleware;