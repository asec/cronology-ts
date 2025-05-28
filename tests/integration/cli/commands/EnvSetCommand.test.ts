import {establishSeparateEnvironmentForTesting} from "../../../_mock/testdotenv";
import {createTestServices} from "../../../_services";
import {cliContext} from "../../../_mock/clicontext";
import Config, {EnvType} from "../../../../src/lib/config/Config";
import ConnectionPool from "../../../../src/lib/utils/ConnectionPool";
import * as fs from "fs";

const pool = new ConnectionPool();

afterAll(async () => {
    await pool.release();
});

afterEach(() => {
    jest.restoreAllMocks();
});

function resetConfig(config: Config<any>): void
{
    config.reset();
    config.setEnvironment(EnvType.Test);
}

it("Tests the basic command flow", async () => {
    const logSpy = jest.spyOn(console, "log").mockImplementation();
    const services = createTestServices();
    await establishSeparateEnvironmentForTesting(services, pool);
    const config = services.resolve("config");

    expect(config.get("APP_ENV")).toBe(EnvType.Test);
    expect(config.get("APP_CLI_ENV")).toBe("false");

    const envSetCommand = services.resolve("cli.command.env-set");
    await envSetCommand.execute(...cliContext([EnvType.Prod]));

    expect(logSpy).nthCalledWith(
        1,
        expect.stringMatching(/api-cli/),
        expect.stringMatching(/set to.*?prod/),
        "\n"
    );
});

it("Tests if it is able to switch cli environments in the sandbox correctly", async () => {
    const logSpy = jest.spyOn(console, "log").mockImplementation();
    const services = createTestServices();
    await establishSeparateEnvironmentForTesting(services, pool);
    const config = services.resolve("config");

    let envGetCommand = services.resolve("cli.command.env-get");
    await envGetCommand.execute(...cliContext());

    expect(config.get("APP_ENV")).toBe(EnvType.Test);
    expect(config.get("APP_CLI_ENV")).toBe("true");

    let envSetCommand = services.resolve("cli.command.env-set");
    await envSetCommand.execute(...cliContext([EnvType.Prod]));

    expect(config.get("APP_ENV")).toBe(EnvType.Prod);
    expect(config.get("APP_CLI_ENV")).toBe("false");

    resetConfig(config);
    envGetCommand = services.resolve("cli.command.env-get");
    await envGetCommand.execute(...cliContext());

    expect(config.get("APP_ENV")).toBe(EnvType.Prod);
    expect(config.get("APP_CLI_ENV")).toBe("true");

    resetConfig(config);
    envSetCommand = services.resolve("cli.command.env-set");
    await envSetCommand.execute(...cliContext([EnvType.Dev]));

    expect(config.get("APP_ENV")).toBe(EnvType.Dev);
    expect(config.get("APP_CLI_ENV")).toBe("false");

    resetConfig(config);
    envGetCommand = services.resolve("cli.command.env-get");
    await envGetCommand.execute(...cliContext());

    expect(config.get("APP_ENV")).toBe(EnvType.Dev);
    expect(config.get("APP_CLI_ENV")).toBe("true");

    expect(logSpy).nthCalledWith(
        1,
        expect.stringMatching(/api-cli/),
        expect.stringMatching(/current CLI.*?test/),
        "\n"
    );
    expect(logSpy).nthCalledWith(
        2,
        expect.stringMatching(/api-cli/),
        expect.stringMatching(/set to.*?prod/),
        "\n"
    );
    expect(logSpy).nthCalledWith(
        3,
        expect.stringMatching(/api-cli/),
        expect.stringMatching(/current CLI.*?prod/),
        "\n"
    );
    expect(logSpy).nthCalledWith(
        4,
        expect.stringMatching(/api-cli/),
        expect.stringMatching(/set to.*?dev/),
        "\n"
    );
    expect(logSpy).nthCalledWith(
        5,
        expect.stringMatching(/api-cli/),
        expect.stringMatching(/current CLI.*?dev/),
        "\n"
    );
});

it("Tests for invalid params", async () => {
    const exitSpy = jest.spyOn(process, "exit").mockImplementation((errorCode: unknown) => {
        throw new Error(`process.exit ${errorCode}`);
    });
    const errorSpy = jest.spyOn(process.stderr, "write").mockImplementation();
    const services = createTestServices();
    const path = await establishSeparateEnvironmentForTesting(services, pool);
    const file = path + "/.env.cli.test.local";
    const config = services.resolve("config");

    // Invalid env argument
    let command = services.resolve("cli.command.env-set");
    await expect(command.execute(...cliContext(["non-existent"]))).rejects.toThrow(/^process\.exit 1$/);
    expect(exitSpy).nthCalledWith(1, 1);
    expect(errorSpy).nthCalledWith(1, expect.stringMatching(/[Ii]nvalid parameter.*?env.*?/));

    // File exists but not readable
    command = services.resolve("cli.command.env-set");
    const localFileExistsMock = jest.spyOn(command as any, "localFileExists").mockImplementation(() => true);
    await expect(command.execute(...cliContext([EnvType.Dev]))).rejects.toThrow(/^process\.exit 1$/);
    expect(exitSpy).nthCalledWith(3, 1);
    expect(errorSpy).nthCalledWith(3, expect.stringMatching(/exists.*?could not be read/));
    localFileExistsMock.mockRestore();

    // File exists, but cannot be written to
    resetConfig(config);
    await fs.promises.writeFile(file, "");
    await fs.promises.chmod(file, 0);
    command = services.resolve("cli.command.env-set");
    await expect(command.execute(...cliContext([EnvType.Dev]))).rejects.toThrow(/^process\.exit 1$/);
    expect(exitSpy).nthCalledWith(5, 1);
    expect(errorSpy).nthCalledWith(5, expect.stringMatching(/could not be written/));
});