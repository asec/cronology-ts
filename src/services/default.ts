import ServiceContainer, {createServiceContainer} from "../lib/service/ServiceContainer";
import Config from "../lib/config/Config";
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

const IProgram = Symbol("IProgram");
const IProcess = Symbol("IProcess");
const IServer = Symbol("IServer");

const services = createServiceContainer();

// Basics
services.register(Config, () => {
    return new Config();
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
        services.resolve(Config)
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
        services.resolve(Config),
        services.resolve(IProgram),
        services.resolve(IProcess)
    );
});

services.register(EnvSetCommand, () => {
    return new EnvSetCommand(
        services.resolve(Config),
        services.resolve(IProgram),
        services.resolve(IProcess)
    );
});

services.register(ServerStartCommand, () => {
    return new ServerStartCommand(
        services.resolve(Config),
        services.resolve(IProgram),
        services.resolve(IProcess),
        services.resolve(IServer),
        services.resolve(ServiceContainer)
    );
});

services.register(PingCommand, () => {
    return new PingCommand(
        services.resolve(Config),
        services.resolve(IProgram),
        services.resolve(IProcess),
        services.resolve(ServiceContainer)
    );
});

services.register(WaitCommand, () => {
    return new WaitCommand(
        services.resolve(Config),
        services.resolve(IProgram),
        services.resolve(IProcess),
        services.resolve(ServiceContainer)
    );
});

// API actions
services.register(PingAction, () => {
    return new PingAction(
        services.resolve(Config)
    );
});

services.register(WaitAction, () => {
    return new WaitAction(
        services.resolve(Profiler)
    );
});

export default services;