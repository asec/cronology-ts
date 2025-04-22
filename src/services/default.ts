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

services.register(ApplicationRepository, () => {
    return new ApplicationRepository(
        services.resolve(IDatabase)
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

export default services;