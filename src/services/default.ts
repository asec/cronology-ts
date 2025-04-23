import ServiceContainer, {createServiceContainer} from "../lib/service/ServiceContainer";
import EnvGetCommand from "../cli/commands/EnvGetCommand";
import {program} from "commander";
import Cli from "../lib/cli/Cli";
import EnvSetCommand from "../cli/commands/EnvSetCommand";
import WebServer from "../api/WebServer";
import ServerStartCommand from "../cli/commands/ServerStartCommand";
import PingAction from "../api/actions/ping/PingAction";
import PingCommand from "../cli/commands/api/PingCommand";
import Profiler from "../lib/utils/Profiler";
import WaitAction from "../api/actions/wait/WaitAction";
import WaitCommand from "../cli/commands/api/WaitCommand";
import AppCreateCommand from "../cli/commands/AppCreateCommand";
import ApplicationRepository from "../entities/repository/ApplicationRepository";
import Memory from "../lib/database/Memory";
import AppConfig from "../config/AppConfig";
import Mongodb from "../lib/database/Mongodb";
import IDatabase from "../lib/database/IDatabase";
import Application from "../entities/Application";
import RsaKeypair from "../lib/utils/RsaKeypair";
import BeanFactory from "../lib/factory/BeanFactory";
import ApplicationFactory from "../entities/factory/ApplicationFactory";
import AppIpCommand from "../cli/commands/AppIpCommand";
import AppKeysCommand from "../cli/commands/AppKeysCommand";
import BadResponseAction from "../api/actions/bad-response/BadResponseAction";
import BadResponseCommand from "../cli/commands/api/BadResponseCommand";
import TestErrorAction from "../api/actions/test-error/TestErrorAction";
import TestErrorCommand from "../cli/commands/api/TestErrorCommand";

const IProgram = Symbol("IProgram");
const IProcess = Symbol("IProcess");
const IServer = Symbol("IServer");
const IDatabase = Symbol("IDatabase");

const services = createServiceContainer();

// Basics
services.register(AppConfig, () => {
    return new AppConfig();
}, true);

services.register(Profiler, () => {
    return new Profiler();
});

services.register(IProgram, () => {
    return program;
}, true);

services.register(IProcess, () => {
    return process;
}, true);

services.register(IServer, () => {
    return new WebServer(
        services.resolve(AppConfig)
    );
});

services.register(RsaKeypair, () => {
    const config = services.resolve(AppConfig);

    return new RsaKeypair(
        () => config.get("CONF_CRYPTO_APPKEYS")
    );
});

services.register(IDatabase, (): IDatabase<any> => {
    const config = services.resolve(AppConfig);

    let db: IDatabase<any>;
    switch (config.get("CONF_DB_TYPE"))
    {
        case "mongodb":
            db = new Mongodb(
                () => config.get("CONF_MONGO_URI"),
                () => config.get("CONF_MONGO_DB"),
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
            db = new Memory();
    }

    return db;
}, true);

services.register(ApplicationFactory, () => {
    return new ApplicationFactory(
        services.resolve(ServiceContainer)
    );
});

services.register(ApplicationRepository, (params?: {factory?: BeanFactory<Application>}) => {
    if (typeof params?.factory === "undefined")
    {
        throw new Error("Service Error: Missing parameter 'factory' for 'ApplicationRepository' resolution.");
    }

    return new ApplicationRepository(
        services.resolve(IDatabase),
        params.factory
    );
});

// CLI related
services.register(Cli, () => {
    return new Cli(
        services.resolve(IProgram)
    );
});

services.register(EnvGetCommand, () => {
    return new EnvGetCommand(
        services.resolve(AppConfig),
        services.resolve(IProgram),
        services.resolve(IProcess),
        services.resolve(ServiceContainer)
    );
});

services.register(EnvSetCommand, () => {
    return new EnvSetCommand(
        services.resolve(AppConfig),
        services.resolve(IProgram),
        services.resolve(IProcess),
        services.resolve(ServiceContainer)
    );
});

services.register(ServerStartCommand, () => {
    return new ServerStartCommand(
        services.resolve(AppConfig),
        services.resolve(IProgram),
        services.resolve(IProcess),
        services.resolve(IServer),
        services.resolve(ServiceContainer)
    );
});

services.register(PingCommand, () => {
    return new PingCommand(
        services.resolve(AppConfig),
        services.resolve(IProgram),
        services.resolve(IProcess),
        services.resolve(ServiceContainer)
    );
});

services.register(WaitCommand, () => {
    return new WaitCommand(
        services.resolve(AppConfig),
        services.resolve(IProgram),
        services.resolve(IProcess),
        services.resolve(ServiceContainer)
    );
});

services.register(AppCreateCommand, () => {
    return new AppCreateCommand(
        services.resolve(AppConfig),
        services.resolve(IProgram),
        services.resolve(IProcess),
        services.resolve(ServiceContainer),
        services.resolve(ApplicationFactory)
    );
});

services.register(AppIpCommand, () => {
    return new AppIpCommand(
        services.resolve(AppConfig),
        services.resolve(IProgram),
        services.resolve(IProcess),
        services.resolve(ServiceContainer),
        services.resolve(ApplicationFactory)
    );
});

services.register(AppKeysCommand, () => {
    return new AppKeysCommand(
        services.resolve(AppConfig),
        services.resolve(IProgram),
        services.resolve(IProcess),
        services.resolve(ServiceContainer),
        services.resolve(ApplicationFactory)
    );
});

services.register(BadResponseCommand, () => {
    return new BadResponseCommand(
        services.resolve(AppConfig),
        services.resolve(IProgram),
        services.resolve(IProcess),
        services.resolve(ServiceContainer)
    );
});

services.register(TestErrorCommand, () => {
    return new TestErrorCommand(
        services.resolve(AppConfig),
        services.resolve(IProgram),
        services.resolve(IProcess),
        services.resolve(ServiceContainer)
    );
});

// API actions
services.register(PingAction, () => {
    return new PingAction(
        services.resolve(AppConfig)
    );
});

services.register(WaitAction, () => {
    return new WaitAction(
        services.resolve(Profiler)
    );
});

services.register(BadResponseAction, () => {
    return new BadResponseAction();
});

services.register(TestErrorAction, () => {
    return new TestErrorAction();
});

export default services;