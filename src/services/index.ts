import ServiceContainer, {createServiceContainer} from "../lib/service/ServiceContainer.js";
import registerServicesBasic from "./basics.js";
import registerServicesCliBasics from "./cli.basics.js";
import registerServicesCliCommands from "./cli.commands.js";
import registerServicesCliActions from "./cli.actions.js";
import registerServicesApiActions from "./api.actions.js";

export interface ServiceInterfaceNames {
    [key: string]: Symbol,

    IProgram: Symbol,
    IProcess: Symbol,
    IServer: Symbol
}

export type ServiceRegistrar = (services: ServiceContainer, interfaces: ServiceInterfaceNames) => void;

const interfaces: ServiceInterfaceNames = {
    IProgram: Symbol("IProgram"),
    IProcess: Symbol("IProcess"),
    IServer: Symbol("IServer")
};

const services = createServiceContainer();

// Basics
registerServicesBasic(services, interfaces);

// CLI related
registerServicesCliBasics(services, interfaces);
registerServicesCliCommands(services, interfaces);
registerServicesCliActions(services, interfaces);

// API actions
registerServicesApiActions(services, interfaces);

export default services;