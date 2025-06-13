import {spyOnCliSuccess} from "../../../_mock/clitools";
import {createTestServices} from "../../../_services";
import {cliContext} from "../../../_mock/clicontext";

/**
 * Note on test isolation:
 * 
 * Each test creates its own isolated service container using createTestServices().
 * The database service is registered as a singleton within each service container,
 * but it's not shared between different service container instances.
 * 
 * The Memorydb implementation used in tests stores data in a Map that's tied to
 * the specific instance of the database driver. Since each service container has
 * its own database driver instance, applications created in one test don't affect
 * other tests.
 * 
 * This is verified by the first test "Verifies that applications don't persist across
 * service container instances", which confirms that applications created in one
 * service container aren't visible to another service container.
 * 
 * Therefore, there's no need to clear applications at the beginning of each test.
 */

afterEach(() => {
    jest.restoreAllMocks();
});

// This test verifies that applications don't persist across service container instances
it("Verifies that applications don't persist across service container instances", async () => {
    // Create the first service container and add an application
    const services1 = createTestServices();
    const factory1 = services1.resolve("factory.application");
    const app = factory1.create({
        name: "test-persistence"
    });
    await factory1.repository().store(app);

    // Verify the application exists in the first container
    const apps1 = await factory1.repository().all();
    expect(apps1.size).toBe(1);

    // Create a second service container and check if the application exists
    const services2 = createTestServices();
    const factory2 = services2.resolve("factory.application");
    const apps2 = await factory2.repository().all();

    // The application should not exist in the second container
    expect(apps2.size).toBe(0);
});

it("Tests listing when no applications exist", async () => {
    const {logSpy} = spyOnCliSuccess();

    // Create an isolated service container
    const services = createTestServices();

    // Each service container has its own isolated database, so no need to clear applications
    const factory = services.resolve("factory.application");
    const command = services.resolve("cli.command.app-list");
    await command.execute(...cliContext());

    const apps = await factory.repository().all();
    expect(apps.size).toBe(0);

    expect(logSpy).toHaveBeenNthCalledWith(
        1,
        expect.stringMatching(/api-cli/),
        expect.stringMatching(/Applications available: .*none/),
        expect.anything()
    );
});

it("Tests listing with a single application", async () => {
    const {logSpy} = spyOnCliSuccess();

    // Create an isolated service container
    const services = createTestServices();

    // Each service container has its own isolated database, so no need to clear applications
    const factory = services.resolve("factory.application");

    // Create a test application
    const appName = "test-app";
    const app = factory.create({
        name: appName
    });
    await factory.repository().store(app);

    const command = services.resolve("cli.command.app-list");
    await command.execute(...cliContext());

    expect(logSpy).toHaveBeenNthCalledWith(
        1,
        expect.stringMatching(/api-cli/),
        expect.stringMatching(new RegExp(`Applications available: .*${appName}`)),
        expect.anything()
    );
});

it("Tests listing with multiple applications", async () => {
    const {logSpy} = spyOnCliSuccess();

    // Create an isolated service container
    const services = createTestServices();

    // Each service container has its own isolated database, so no need to clear applications
    const factory = services.resolve("factory.application");

    // Create test applications
    const appNames = ["test-app1", "test-app2", "test-app3"];
    for (const name of appNames) {
        const app = factory.create({
            name: name
        });
        await factory.repository().store(app);
    }

    const command = services.resolve("cli.command.app-list");
    await command.execute(...cliContext());

    // Verify all app names are in the output
    expect(logSpy).toHaveBeenNthCalledWith(
        1,
        expect.stringMatching(/api-cli/),
        expect.stringMatching(new RegExp(`Applications available: .*${appNames.join(".*")}`)),
        expect.anything()
    );

    // Verify each app name individually
    for (const name of appNames) {
        expect(logSpy).toHaveBeenNthCalledWith(
            1,
            expect.stringMatching(/api-cli/),
            expect.stringMatching(new RegExp(`.*${name}.*`)),
            expect.anything()
        );
    }
});

it("Tests that application names are correctly colored", async () => {
    const {logSpy} = spyOnCliSuccess();

    // Create an isolated service container
    const services = createTestServices();

    // Create a spy on the green method of the command
    const command = services.resolve("cli.command.app-list");
    const greenSpy = jest.spyOn(command as any, "green");

    // Each service container has its own isolated database, so no need to clear applications
    const factory = services.resolve("factory.application");

    // Create a test application
    const appName = "test-app";
    const app = factory.create({
        name: appName
    });
    await factory.repository().store(app);

    await command.execute(...cliContext());

    // Verify the green method was called with the app name
    expect(greenSpy).toHaveBeenCalledWith(appName);

    // Verify the output contains the colored app name
    expect(logSpy).toHaveBeenNthCalledWith(
        1,
        expect.stringMatching(/api-cli/),
        expect.stringMatching(new RegExp(`Applications available: .*${appName}`)),
        expect.anything()
    );
});

it("Tests that the output is correctly formatted", async () => {
    const {logSpy} = spyOnCliSuccess();

    // Create an isolated service container
    const services = createTestServices();

    // Create a spy on the output method of the command
    const command = services.resolve("cli.command.app-list");
    const outputSpy = jest.spyOn(command as any, "output");

    // Each service container has its own isolated database, so no need to clear applications
    const factory = services.resolve("factory.application");

    // Create test applications
    const appNames = ["test-app1", "test-app2"];
    for (const name of appNames) {
        const app = factory.create({
            name: name
        });
        await factory.repository().store(app);
    }

    await command.execute(...cliContext());

    // Verify the output method was called with the correct format
    expect(outputSpy).toHaveBeenCalledWith(expect.stringMatching(/Applications available: .*/));

    // Verify the output contains both app names separated by a comma
    expect(logSpy).toHaveBeenNthCalledWith(
        1,
        expect.stringMatching(/api-cli/),
        expect.stringMatching(new RegExp(`Applications available: .*${appNames[0]}.*,.*${appNames[1]}`)),
        expect.anything()
    );
});
