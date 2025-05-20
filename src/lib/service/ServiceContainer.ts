import {ServiceBindingsFull} from "../../services/index.js";

export interface ServiceBindings {
    [key: string]: (...params: any[]) => unknown

    "": never
    services: () => ServiceContainer<this>
}

export default class ServiceContainer<Bindings extends ServiceBindings = ServiceBindingsFull>
{
    protected bindings = new Map<string, (...params: any[]) => any>();

    register<T extends keyof Bindings>(type: T, factory: Bindings[T], singleton: boolean = false)
    {
        const token = type;

        if (singleton)
        {
            let singletonFactory = (() => {
                let instance = null;
                return (...params: Parameters<Bindings[T]>) => {
                    if (instance === null)
                    {
                        instance = factory(...params);
                    }

                    return instance;
                };
            })();
            this.bindings.set(token as string, singletonFactory);
        }
        else
        {
            this.bindings.set(token as string, factory);
        }
    }

    resolve<T extends keyof Bindings>(type: T, ...params: Parameters<Bindings[T]>): ReturnType<Bindings[T]>
    {
        const token = type;
        const factory = this.bindings.get(token as string);

        if (!factory)
        {
            throw new Error("Service does not exists: " + (token as string));
        }

        return factory(...params);
    }
}

export function createServiceContainer<Bindings extends ServiceBindings>(): ServiceContainer<Bindings>
{
    const container = new ServiceContainer<Bindings>();
    container.register("services", () => container);

    return container;
}