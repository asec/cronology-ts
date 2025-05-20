import ServiceContainer, {createServiceContainer, ServiceBindings} from "../lib/service/ServiceContainer.js";
import registerServicesBasic, {ServiceBindingsBasic} from "./basics.js";
import registerServicesCliBasics, {ServiceBindingsCli} from "./cli.basics.js";
import registerServicesCliCommands, {ServiceBindingsCliCommands} from "./cli.commands.js";
import registerServicesCliActions, {ServiceBindingsCliActions} from "./cli.actions.js";
import registerServicesApiActions, {ServiceBindingsApiActions} from "./api.actions.js";

export type ServiceBindingsFull = ServiceBindings
    & ServiceBindingsBasic
    & ServiceBindingsApiActions
    & ServiceBindingsCli
    & ServiceBindingsCliActions
    & ServiceBindingsCliCommands
;

export type ServiceRegistrar = (services: ServiceContainer<ServiceBindingsFull>) => void;

export function createServices(): ServiceContainer<ServiceBindingsFull>
{
    const services = createServiceContainer();

    // Basics
    registerServicesBasic(services);

    // CLI related
    registerServicesCliBasics(services);
    registerServicesCliCommands(services);
    registerServicesCliActions(services);

    // API actions
    registerServicesApiActions(services);

    return services;
}


const services = createServices();
export default services;