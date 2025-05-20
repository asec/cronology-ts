import {testServices} from "../../../_services";
import {cliContext} from "../../../_mock/clicontext";
import ConnectionPool from "../../../../src/lib/utils/ConnectionPool";

afterEach(() => {
    jest.clearAllMocks();
});

it("Tests the basic command flow", async () => {
    const logSpy = jest.spyOn(console, "log").mockImplementation();
    const files = testServices.resolve("factory.testFile");
    const connectionPool = new ConnectionPool();
    connectionPool.add(files);

    const envCli = files.create(".env.cli");
    const envCliLocal = files.create(".env.cli.local");
    const envTest = files.create(".env.test");
    const envTestLocal = files.create(".env.test.local");

    await envCli.copy(".env.cli");
    await envCliLocal.create();
    await envTest.copy(".env.test");
    try
    {
        await envTestLocal.copy(".env.test.local")
    }
    catch
    {
        await envTestLocal.create();
    }

    testServices.resolve("config", {
        test: envCli.path() + "/"
    });

    const command = testServices.resolve("cli.command.env-get");
    await command.execute(...cliContext());

    expect(logSpy).nthCalledWith(
        1,
        expect.stringMatching(/api-cli/),
        expect.stringMatching(/current CLI.*?test/),
        "\n"
    );

    await connectionPool.release();
});