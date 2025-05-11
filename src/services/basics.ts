import ServiceContainer from "../lib/service/ServiceContainer.js";
import AppConfig from "../config/AppConfig.js";
import Profiler from "../lib/utils/Profiler.js";
import PackageInfo from "../lib/utils/PackageInfo.js";
import {program} from "commander";
import WebServer from "../api/WebServer.js";
import RsaKeypair from "../lib/utils/RsaKeypair.js";
import {ServiceRegistrar} from "./index.js";

const registerServicesBasic: ServiceRegistrar = (services, interfaces): void => {
    const {IProgram, IProcess, IServer} = interfaces;

    services.register(AppConfig, () => {
        return new AppConfig();
    }, true);

    services.register(Profiler, () => {
        return new Profiler();
    });

    services.register(PackageInfo, () => {
        return new PackageInfo();
    });

    services.register(IProgram, () => {
        return program;
    }, true);

    services.register(IProcess, () => {
        return process;
    }, true);

    services.register(IServer, () => {
        return new WebServer(
            services.resolve(AppConfig),
            services.resolve(ServiceContainer)
        );
    });

    services.register(RsaKeypair, () => {
        const config = services.resolve(AppConfig);

        return new RsaKeypair(
            () => config.get("CONF_CRYPTO_APPKEYS")
        );
    });
};

export default registerServicesBasic;