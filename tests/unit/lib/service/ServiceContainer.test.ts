import ServiceContainer, {createServiceContainer} from "../../../../src/lib/service/ServiceContainer";

it("Creates an empty service container", () => {
    const services = createServiceContainer();
    expect(services.resolve(ServiceContainer)).toBe(services);
});

it("Defines some services and then retrieves them", () => {
    const services = createServiceContainer();

    const ITest = Symbol("TestService");
    class TestService
    {
        public foo(): string
        {
            return "bar";
        }

        public bar(): number
        {
            return 1;
        }
    }

    class InvalidService
    {}

    services.register(TestService, () => new TestService());
    services.register(ITest, () => services.resolve(TestService));

    const test = services.resolve(TestService);
    expect(test).toBeInstanceOf(TestService);
    expect(test.foo()).toBe("bar");
    expect(test.bar()).toBe(1);

    const test2: TestService = services.resolve(ITest);
    expect(test2).toBeInstanceOf(TestService);
    expect(test.foo()).toBe("bar");
    expect(test.bar()).toBe(1);

    expect(() => services.resolve(Symbol("InvalidService"))).toThrowError(/does not exists/);
    expect(() => services.resolve(InvalidService)).toThrowError(/does not exists/);
});

it("Tests non-singletons and parametric instantiation", () => {
    const services = createServiceContainer();

    const ICounter = Symbol("ICounter");
    class TestService
    {
        public constructor(
            private counter: number
        )
        {}

        public count(): number
        {
            return this.counter;
        }

        public increase(): void
        {
            this.counter++;
        }

        public decrease(): void
        {
            this.counter--;
        }
    }

    services.register(ICounter, (start: number) => new TestService(start));

    const test1: TestService = services.resolve(ICounter, 1);
    expect(test1.count()).toBe(1);
    test1.increase();
    test1.increase();
    expect(test1.count()).toBe(3);
    test1.decrease();
    expect(test1.count()).toBe(2);

    const test2: TestService = services.resolve(ICounter, 20);
    expect(test2.count()).toBe(20);
    test2.increase();
    expect(test2.count()).toBe(21);
    test2.decrease();
    test2.decrease();
    expect(test2.count()).toBe(19);
    expect(test1.count()).toBe(2);

    expect(test1).not.toBe(test2);
});

it("Tests singletons", () => {
    const services = createServiceContainer();

    const ICounter = Symbol("ICounter");
    class Counter
    {
        public constructor(
            private counter: number
        )
        {}

        public count(): number
        {
            return this.counter;
        }

        public increase(): void
        {
            this.counter++;
        }

        public decrease(): void
        {
            this.counter--;
        }
    }

    services.register(Counter, (start: number = 0) => new Counter(start), true);
    services.register(ICounter, (start: number = 0) => new Counter(start), true);

    const test1 = services.resolve(Counter);
    expect(test1.count()).toBe(0);
    test1.increase();
    test1.increase();
    expect(test1.count()).toBe(2);
    test1.decrease();
    expect(test1.count()).toBe(1);

    const test2 = services.resolve(Counter);
    expect(test2.count()).toBe(1);
    test2.decrease();
    test2.decrease();
    expect(test2.count()).toBe(-1);
    expect(test1.count()).toBe(-1);

    expect(test1).toBe(test2);

    const test3 = services.resolve(Counter, 10);
    expect(test3.count()).toBe(-1);

    const test4: Counter = services.resolve(ICounter, 1);
    expect(test4.count()).toBe(1);

    expect(test4).not.toBe(test1);
    expect(test4).not.toBe(test2);
    expect(test4).not.toBe(test3);
});