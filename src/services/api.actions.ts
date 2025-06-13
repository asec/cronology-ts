import {ServiceRegistrar} from "./index.js";
import PingAction from "../api/actions/ping/PingAction.js";
import BadResponseAction from "../api/actions/bad-response/BadResponseAction.js";
import TestErrorAction from "../api/actions/test-error/TestErrorAction.js";
import WaitAction from "../api/actions/wait/WaitAction.js";
import {ServiceBindings} from "../lib/service/ServiceContainer.js";
import ApiAction from "../lib/api/action/ApiAction.js";

export interface ServiceBindingsApiActions extends ServiceBindings
{
    "api.action.ping": () => PingAction,
    "api.action.badResponse": () => BadResponseAction,
    "api.action.testError": () => TestErrorAction,
    "api.action.wait": () => WaitAction
}

const registerServicesApiActions: ServiceRegistrar = (services) => {

    function registerMiddleware<TAction extends ApiAction<any, any>>(action: TAction): TAction
    {
        action.use(services.resolve("api.action.middleware.logger"));

        return action;
    }

    services.register("api.action.ping", () => {
        return registerMiddleware(new PingAction(
            services.resolve("config"),
            services.resolve("packageInfo")
        ));
    });

    services.register("api.action.badResponse", () => {
        return registerMiddleware(new BadResponseAction());
    });

    services.register("api.action.testError", () => {
        return registerMiddleware(new TestErrorAction());
    });

    services.register("api.action.wait", () => {
        return registerMiddleware(new WaitAction(
            services.resolve("profiler")
        ));
    });
};

export default registerServicesApiActions;