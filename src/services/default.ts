import ServiceContainer, {createServiceContainer} from "../lib/service/ServiceContainer.js";
import EnvGetCommand from "../cli/commands/EnvGetCommand.js";
import {program} from "commander";
import Cli from "../lib/cli/Cli.js";
import EnvSetCommand from "../cli/commands/EnvSetCommand.js";
import WebServer from "../api/WebServer.js";
import ServerStartCommand from "../cli/commands/ServerStartCommand.js";
import PingAction from "../api/actions/ping/PingAction.js";
import PingCommand from "../cli/commands/api/PingCommand.js";
import Profiler from "../lib/utils/Profiler.js";
import WaitAction from "../api/actions/wait/WaitAction.js";
import WaitCommand from "../cli/commands/api/WaitCommand.js";
import AppCreateCommand from "../cli/commands/AppCreateCommand.js";
import ApplicationRepository from "../entities/repository/ApplicationRepository.js";
import Memory from "../lib/database/Memory.js";
import AppConfig from "../config/AppConfig.js";
import Mongodb from "../lib/database/Mongodb.js";
import IDatabase from "../lib/database/IDatabase.js";
import Application from "../entities/Application.js";
import RsaKeypair from "../lib/utils/RsaKeypair.js";
import BeanFactory from "../lib/factory/BeanFactory.js";
import ApplicationFactory from "../entities/factory/ApplicationFactory.js";
import AppIpCommand from "../cli/commands/AppIpCommand.js";
import AppKeysCommand from "../cli/commands/AppKeysCommand.js";
import BadResponseAction from "../api/actions/bad-response/BadResponseAction.js";
import BadResponseCommand from "../cli/commands/api/BadResponseCommand.js";
import TestErrorAction from "../api/actions/test-error/TestErrorAction.js";
import TestErrorCommand from "../cli/commands/api/TestErrorCommand.js";
import AppDataAction from "../api/actions/app-data/AppDataAction.js";
import AppDataActionParamsParser from "../api/actions/app-data/params/AppDataActionParamsParser.js";
import {Request} from "express";
import AppDataActionParams from "../api/actions/app-data/params/AppDataActionParams.js";
import AppDataCommand from "../cli/commands/api/AppDataCommand.js";
import PackageInfo from "../lib/utils/PackageInfo.js";

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
        services.resolve(IProgram),
        services.resolve(PackageInfo)
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

services.register(AppDataCommand, () => {
    return new AppDataCommand(
        services.resolve(AppConfig),
        services.resolve(IProgram),
        services.resolve(IProcess),
        services.resolve(ServiceContainer),
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
        services.resolve(AppConfig),
        services.resolve(PackageInfo)
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

services.register(AppDataAction, () => {
    return new AppDataAction();
});

services.register(AppDataActionParams, () => {
    return new AppDataActionParams(
        services.resolve(ApplicationFactory)
    );
});

services.register(AppDataActionParamsParser, (params?: { request: Request<any> }) => {
    return new AppDataActionParamsParser(
        params.request,
        services.resolve(ApplicationFactory)
    );
});

export default services;