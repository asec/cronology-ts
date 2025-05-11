import {ServiceRegistrar} from "./index.js";
import PingAction from "../api/actions/ping/PingAction.js";
import AppConfig from "../config/AppConfig.js";
import PackageInfo from "../lib/utils/PackageInfo.js";
import BadResponseAction from "../api/actions/bad-response/BadResponseAction.js";
import TestErrorAction from "../api/actions/test-error/TestErrorAction.js";
import WaitAction from "../api/actions/wait/WaitAction.js";
import Profiler from "../lib/utils/Profiler.js";

const registerServicesApiActions: ServiceRegistrar = (services, interfaces) => {

    services.register(PingAction, () => {
        return new PingAction(
            services.resolve(AppConfig),
            services.resolve(PackageInfo)
        );
    });

    services.register(BadResponseAction, () => {
        return new BadResponseAction();
    });

    services.register(TestErrorAction, () => {
        return new TestErrorAction();
    });

    services.register(WaitAction, () => {
        return new WaitAction(
            services.resolve(Profiler)
        );
    });
};

export default registerServicesApiActions;