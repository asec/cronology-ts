type Constructor<T = any> = new (...args: any[]) => T;
type Token<T> = Constructor<T> | Symbol;

export default class ServiceContainer
{
    protected bindings = new Map<string, () => any>();

    register<T>(type: Token<T>, factory: () => T)
    {
        const token = typeof type === "symbol" ? type.toString() : (<Constructor<T>> type).name;
        this.bindings.set(token, factory);
    }

    resolve<T>(type: Token<T>): T
    {
        const token = typeof type === "symbol" ? type.toString() : (<Constructor<T>> type).name;
        const factory = this.bindings.get(token);

        if (!factory)
        {
            throw new Error("Service does not exists: " + token);
        }

        return factory();
    }
}

export function createServiceContainer(): ServiceContainer
{
    const container = new ServiceContainer();
    container.register(ServiceContainer, () => container);

    return container;
}