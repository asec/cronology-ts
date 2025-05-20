import {ServiceRegistrar} from "./index.js";
import PingAction from "../api/actions/ping/PingAction.js";
import BadResponseAction from "../api/actions/bad-response/BadResponseAction.js";
import TestErrorAction from "../api/actions/test-error/TestErrorAction.js";
import WaitAction from "../api/actions/wait/WaitAction.js";
import {ServiceBindings} from "../lib/service/ServiceContainer.js";

export interface ServiceBindingsApiActions extends ServiceBindings
{
    "api.action.ping": () => PingAction,
    "api.action.badResponse": () => BadResponseAction,
    "api.action.testError": () => TestErrorAction,
    "api.action.wait": () => WaitAction
}

const registerServicesApiActions: ServiceRegistrar = (services) => {

    services.register("api.action.ping", () => {
        return new PingAction(
            services.resolve("config"),
            services.resolve("packageInfo")
        );
    });

    services.register("api.action.badResponse", () => {
        return new BadResponseAction();
    });

    services.register("api.action.testError", () => {
        return new TestErrorAction();
    });

    services.register("api.action.wait", () => {
        return new WaitAction(
            services.resolve("profiler")
        );
    });
};

export default registerServicesApiActions;