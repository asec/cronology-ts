import ServiceContainer from "../lib/service/ServiceContainer.js";
import AppConfig from "../config/AppConfig.js";
import Profiler from "../lib/utils/Profiler.js";
import PackageInfo from "../lib/utils/PackageInfo.js";
import {program} from "commander";
import WebServer from "../api/WebServer.js";
import RsaKeypair from "../lib/utils/RsaKeypair.js";
import {ServiceRegistrar} from "./index.js";
import ApplicationFactory from "../entities/factory/ApplicationFactory.js";
import Memorydb from "../lib/database/Memorydb.js";
import Repository from "../lib/entities/Repository.js";
import Factory from "../lib/entities/Factory.js";
import Entity from "../lib/entities/Entity.js";
import {DataObject} from "../lib/datastructures/DataObject.js";
import CronologyError from "../lib/error/CronologyError.js";

const registerServicesBasic: ServiceRegistrar = (services, interfaces): void => {
    const {IProgram, IProcess, IServer, IDatabase} = interfaces;

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

    services.register(IDatabase, () => {
        return new Memorydb();
    }, true);

    services.register(Repository, (factory: Factory<Entity<DataObject>>) => {
        if (!factory || !(factory instanceof Factory))
        {
            throw new CronologyError("Service Error: Missing parameter 'factory' for 'Repository' resolution.");
        }

        return new Repository(
            factory,
            services.resolve(IDatabase)
        );
    });

    services.register(ApplicationFactory, () => {
        return new ApplicationFactory(
            services.resolve(ServiceContainer)
        );
    }, true);
};

export default registerServicesBasic;