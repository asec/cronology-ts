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
import AppConfig from "../config/AppConfig.js";
import RsaKeypair from "../lib/utils/RsaKeypair.js";
import BadResponseAction from "../api/actions/bad-response/BadResponseAction.js";
import BadResponseCommand from "../cli/commands/api/BadResponseCommand.js";
import TestErrorAction from "../api/actions/test-error/TestErrorAction.js";
import TestErrorCommand from "../cli/commands/api/TestErrorCommand.js";
import PackageInfo from "../lib/utils/PackageInfo.js";
import WaitAction from "../api/actions/wait/WaitAction.js";
import WaitCommand from "../cli/commands/api/WaitCommand.js";

const IProgram = Symbol("IProgram");
const IProcess = Symbol("IProcess");
const IServer = Symbol("IServer");

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

services.register(WaitCommand, () => {
    return new WaitCommand(
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

export default services;