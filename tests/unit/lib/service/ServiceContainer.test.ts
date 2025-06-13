import ServiceContainer, {createServiceContainer, ServiceBindings} from "../../../../src/lib/service/ServiceContainer";

describe("ServiceContainer", () => {

    describe("Basic functionality", () => {

        it("Creates an empty service container", () => {
            const services = createServiceContainer();
            expect(services.resolve("services")).toBe(services);
        });

        it("Defines some services and then retrieves them", () => {
            interface ServiceBindingsLocalTest extends ServiceBindings
            {
                TestService: () => TestService,
                ITest: () => TestService
            }

            const services: ServiceContainer<ServiceBindingsLocalTest> = createServiceContainer();

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

            services.register("TestService", () => new TestService());
            services.register("ITest", () => services.resolve("TestService"));

            const test = services.resolve("TestService");
            expect(test).toBeInstanceOf(TestService);
            expect(test.foo()).toBe("bar");
            expect(test.bar()).toBe(1);

            const test2: TestService = services.resolve("ITest");
            expect(test2).toBeInstanceOf(TestService);
            expect(test.foo()).toBe("bar");
            expect(test.bar()).toBe(1);

            expect(() => services.resolve("InvalidService")).toThrowError(/does not exists/);
            expect(() => services.resolve(InvalidService.name)).toThrowError(/does not exists/);
        });

        it("Tests non-singletons and parametric instantiation", () => {
            interface ServiceBindingsLocalTest extends ServiceBindings
            {
                ICounter: (start: number) => TestService
            }

            const services: ServiceContainer<ServiceBindingsLocalTest> = createServiceContainer();

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

            services.register("ICounter", (start: number) => new TestService(start));

            const test1: TestService = services.resolve("ICounter", 1);
            expect(test1.count()).toBe(1);
            test1.increase();
            test1.increase();
            expect(test1.count()).toBe(3);
            test1.decrease();
            expect(test1.count()).toBe(2);

            const test2: TestService = services.resolve("ICounter", 20);
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
            interface ServiceBindingsLocalTest extends ServiceBindings
            {
                Counter: (start?: number) => Counter
                ICounter: (start?: number) => Counter
            }

            const services: ServiceContainer<ServiceBindingsLocalTest> = createServiceContainer();

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

            services.register("Counter", (start: number = 0) => new Counter(start), true);
            services.register("ICounter", (start: number = 0) => new Counter(start), true);

            const test1 = services.resolve("Counter");
            expect(test1.count()).toBe(0);
            test1.increase();
            test1.increase();
            expect(test1.count()).toBe(2);
            test1.decrease();
            expect(test1.count()).toBe(1);

            const test2 = services.resolve("Counter");
            expect(test2.count()).toBe(1);
            test2.decrease();
            test2.decrease();
            expect(test2.count()).toBe(-1);
            expect(test1.count()).toBe(-1);

            expect(test1).toBe(test2);

            const test3 = services.resolve("Counter", 10);
            expect(test3.count()).toBe(-1);

            const test4: Counter = services.resolve("ICounter", 1);
            expect(test4.count()).toBe(1);

            expect(test4).not.toBe(test1);
            expect(test4).not.toBe(test2);
            expect(test4).not.toBe(test3);
        });

    });

    describe("Overriding services", () => {

        it("Overrides a service with a non-singleton", () => {
            interface ServiceBindingsLocalTest extends ServiceBindings
            {
                testService: () => number
            }
            const services: ServiceContainer<ServiceBindingsLocalTest> = createServiceContainer();

            services.register("testService", () => 1);
            expect(services.resolve("testService")).toBe(1);

            services.register("testService", () => 2);
            expect(services.resolve("testService")).toBe(2);
        });

        it("Overrides a service with a singleton", () => {
            class TestObject
            {
                constructor(
                    public counter: number
                )
                {}
            }

            interface ServiceBindingsLocalTest extends ServiceBindings
            {
                testService: () => TestObject
            }
            const services: ServiceContainer<ServiceBindingsLocalTest> = createServiceContainer();

            services.register("testService", () => new TestObject(3), true);
            const obj = services.resolve("testService");

            expect(obj.counter).toBe(3);
            expect(services.resolve("testService")).toBe(obj);

            // Potential issue: It is possible to replace a singleton with another singleton
            services.register("testService", () => new TestObject(4), true);
            const obj2 = services.resolve("testService");

            expect(obj2.counter).toBe(4);
            expect(services.resolve("testService")).toBe(obj2);
            expect(obj).not.toBe(obj2);

            // Potential issue: It is possible to replace a singleton with a normal object factory too
            services.register("testService", () => new TestObject(5));
            const obj3 = services.resolve("testService");

            expect(obj3.counter).toBe(5);
            expect(services.resolve("testService")).not.toBe(obj3);
        });

    });

    describe("Circular dependencies", () => {

        it("Tests circular dependencies", () => {
            class Service1
            {
                constructor(
                    private service2: Service2
                )
                {}
            }

            class Service2
            {
                constructor(
                    private service1: Service1
                )
                {}
            }

            interface ServiceBindingsLocalTest extends ServiceBindings
            {
                s1: () => Service1,
                s2: () => Service2
            }

            const services: ServiceContainer<ServiceBindingsLocalTest> = createServiceContainer();
            services.register("s1", () => new Service1(services.resolve("s2")));
            services.register("s2", () => new Service2(services.resolve("s1")));

            expect(() => services.resolve("s1")).toThrow(/call stack size/);
            expect(() => services.resolve("s2")).toThrow(/call stack size/);
        });

    });

    describe("Having errors during instantiation", () => {

        it("Tests errors during instantiation", () => {
            interface ServiceBindingsLocalTest extends ServiceBindings
            {
                "error": () => never
            }

            const services: ServiceContainer<ServiceBindingsLocalTest> = createServiceContainer();
            services.register("error", () => { throw new Error("Service error") });

            expect(() => services.resolve("error")).toThrow(/Service error/i);
        });

    });

});