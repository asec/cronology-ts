import {ServiceBindings} from "../lib/service/ServiceContainer.js";
import ActionLogger from "../api/middleware/ActionLogger.js";
import {ServiceRegistrar} from "./index.js";

export interface ServiceBindingsApiActionsMiddleware extends ServiceBindings
{
    "api.action.middleware.logger": () => ActionLogger
}

const registerServicesApiActionsMiddleware: ServiceRegistrar = (services) => {

    services.register("api.action.middleware.logger", () => {
        return new ActionLogger(
            services.resolve("services"),
            services.resolve("uuid")
        );
    });
};

export default registerServicesApiActionsMiddleware;