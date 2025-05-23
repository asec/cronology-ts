type Constructor<T = any> = new (...args: any[]) => T;
type Token<T> = Constructor<T> | Symbol;

export default class ServiceContainer
{
    protected bindings = new Map<string, (params?: {}) => any>();

    register<T>(type: Token<T>, factory: (params?: {}) => T, singleton: boolean = false)
    {
        const token = typeof type === "symbol" ? type.toString() : (<Constructor<T>> type).name;

        if (singleton)
        {
            let singletonFactory = (() => {
                let instance = null;
                return (params?: {}) => {
                    if (instance === null)
                    {
                        instance = factory(params);
                    }

                    return instance;
                };
            })();
            this.bindings.set(token, singletonFactory);
        }
        else
        {
            this.bindings.set(token, factory);
        }
    }

    resolve<T>(type: Token<T>, params?: {}): T
    {
        const token = typeof type === "symbol" ? type.toString() : (<Constructor<T>> type).name;
        const factory = this.bindings.get(token);

        if (!factory)
        {
            throw new Error("Service does not exists: " + token);
        }

        return factory(params);
    }
}

export function createServiceContainer(): ServiceContainer
{
    const container = new ServiceContainer();
    container.register(ServiceContainer, () => container);

    return container;
}