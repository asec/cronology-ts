import {ServiceBindings} from "../lib/service/ServiceContainer.js";
import AppConfig from "../config/AppConfig.js";
import Profiler from "../lib/utils/Profiler.js";
import PackageInfo from "../lib/utils/PackageInfo.js";
import {Command, program} from "commander";
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
import ValidatorFactory from "../lib/validation/ValidatorFactory.js";
import ApplicationValidator from "../validation/ApplicationValidator.js";
import Application from "../entities/Application.js";
import IDatabase from "../lib/database/IDatabase.js";
import Mongodb from "../lib/database/Mongodb.js";
import ConnectionPool from "../lib/utils/ConnectionPool.js";
import {EnvType} from "../lib/config/Config.js";
import IServer from "../lib/server/IServer.js";
import uuid, {Uuid} from "../lib/utils/Uuid.js";
import ILogger from "../lib/logger/ILogger.js";
import ConsoleLogger from "../lib/logger/ConsoleLogger.js";
import ProfiledLogger from "../lib/logger/ProfiledLogger.js";
import NullLogger from "../lib/logger/NullLogger.js";
import FileLogger from "../lib/logger/FileLogger.js";

export interface ServiceBindingsBasic extends ServiceBindings
{
    config: (envPaths?: Partial<{[K in EnvType]: string}>) => AppConfig,
    profiler: () => Profiler,
    packageInfo: () => PackageInfo,
    program: () => Command,
    process: () => NodeJS.Process,
    server: () => IServer,
    connectionPool: () => ConnectionPool,
    rsaKeypair: () => RsaKeypair,
    database: () => IDatabase<Entity<DataObject>>,
    repository: (factory: Factory<Entity<DataObject>>) => Repository<Entity<DataObject>>,
    "factory.application": () => ApplicationFactory,
    validators: () => ValidatorFactory,
    uuid: () => Uuid,
    logger: (prefix: string) => ILogger,
    "logger.cli": () => ILogger,
    "logger.api": () => ILogger
}

const registerServicesBasic: ServiceRegistrar = (services): void => {

    services.register("config", (envPaths: Partial<{[K in EnvType]: string}> = {}) => new AppConfig(envPaths), true);

    services.register("profiler", () => new Profiler());

    services.register("packageInfo", () => new PackageInfo());

    services.register("program", () => program, true);

    services.register("process", () => process, true);

    services.register("server", () => {
        return new WebServer(
            services.resolve("config"),
            services.resolve("logger.api")
        );
    });

    services.register("connectionPool", () => new ConnectionPool(), true);

    services.register("rsaKeypair", () => {
        const config = services.resolve("config");

        return new RsaKeypair(
            () => config.get("CONF_CRYPTO_APPKEYS")
        );
    });

    services.register("database", () => {
        const config = services.resolve("config");

        let db: IDatabase<any>;
        switch (config.get("CONF_DB_TYPE"))
        {
            case "mongodb":
                db = new Mongodb(
                    () => config.get("CONF_MONGO_URI"),
                    () => config.get("CONF_MONGO_DB"),
                    services.resolve("connectionPool"),
                    {
                        [Application.name]: config.get("CONF_MONGO_TABLE_APPLICATIONS")
                    },
                    {
                        [Application.name]: [
                            {spec: {name: 1}, options: {unique: true}},
                            {spec: {uuid: 1}, options: {unique: true}}
                        ]
                    }
                );
                break;
            default:
                db = new Memorydb();
        }

        return db;
    }, true);

    services.register("repository", (factory: Factory<Entity<DataObject>>) => {
        if (!factory || !(factory instanceof Factory))
        {
            throw new CronologyError("Service Error: Missing parameter 'factory' for 'Repository' resolution.");
        }

        return new Repository(
            factory,
            services.resolve("database")
        );
    });

    services.register("factory.application", () => {
        return new ApplicationFactory(
            services.resolve("services")
        );
    }, true);

    services.register("validators", () => {
        const factory = new ValidatorFactory();

        factory.register("application", (app: Application) => {
            return new ApplicationValidator(app, services.resolve("factory.application").repository());
        });

        return factory;
    }, true);

    services.register("uuid", () => uuid);

    services.register("logger", (prefix: string): ILogger => {
        const config = services.resolve("config");
        let logger: ILogger;

        switch (config.get("CONF_LOG_TYPE"))
        {
            case "file":
                logger = new FileLogger(
                    () => config.get("CONF_LOG_FILE_DIR"),
                    prefix
                );
                break;
            case "console":
                logger = new ConsoleLogger(prefix);
                break;
            default:
                logger = new NullLogger();
        }

        if (config.get("CONF_LOG_PROFILED") === "true")
        {
            logger = new ProfiledLogger(
                logger,
                services.resolve("profiler")
            );
        }
        return logger;
    });

    services.register("logger.cli", () => services.resolve("logger", "log.cli"), true);

    services.register("logger.api", () => services.resolve("logger", "log.api"), true);
};

export default registerServicesBasic;