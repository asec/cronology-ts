import {establishSeparateEnvironmentForTesting, FileList} from "../../../_mock/testdotenv";
import {createTestServices} from "../../../_services";
import {cliContext} from "../../../_mock/clicontext";
import Config, {EnvType} from "../../../../src/lib/config/Config";
import ConnectionPool from "../../../../src/lib/utils/ConnectionPool";
import * as fs from "fs";
import {spyOnCliError, spyOnCliSuccess} from "../../../_mock/clitools";
import EnvSetCommand from "../../../../src/cli/commands/EnvSetCommand";

const pool = new ConnectionPool();

afterAll(async () => {
    await pool.release();
});

afterEach(() => {
    jest.restoreAllMocks();
});

function resetConfig(config: Config<any>): void
{
    config.setEnvironment();
}

function fileListWithLocal(): FileList
{
    return {
        ".env": "copy",
        ".env.local": "none",
        ".env.dev": "copy",
        ".env.test": "copy"
    };
}

it.each([EnvType.Prod, EnvType.Dev])("Tests the basic command flow (%s)", async (env: EnvType) => {
    const {logSpy} = spyOnCliSuccess();
    const services = createTestServices();
    const path = await establishSeparateEnvironmentForTesting(services, pool, fileListWithLocal());
    const file = path + "/.env.local";

    services.register("cli.command.env-set", (): EnvSetCommand => {
        return new EnvSetCommand(
            services.resolve("cli.dependencies"),
            file
        );
    });

    const config = services.resolve("config");

    expect(config.get("APP_ENV")).toBe(EnvType.Test);

    const envSetCommand = services.resolve("cli.command.env-set");
    await envSetCommand.execute(...cliContext([env]));

    expect(logSpy).nthCalledWith(
        1,
        expect.stringMatching(/api-cli/),
        expect.stringMatching(new RegExp(`set to.*?${env}`)),
        "\n"
    );

    config.setEnvironment();
    expect(config.getCurrentEnv()).toBe(env);
});

it("Tests if it is able to switch cli environments in the sandbox correctly", async () => {
    const {logSpy} = spyOnCliSuccess();
    const services = createTestServices();
    const path = await establishSeparateEnvironmentForTesting(services, pool, fileListWithLocal());
    const file = path + "/.env.local";

    services.register("cli.command.env-set", (): EnvSetCommand => {
        return new EnvSetCommand(
            services.resolve("cli.dependencies"),
            file
        );
    });

    const config = services.resolve("config");

    let envGetCommand = services.resolve("cli.command.env-get");
    await envGetCommand.execute(...cliContext());

    expect(config.get("APP_ENV")).toBe(EnvType.Test);

    let envSetCommand = services.resolve("cli.command.env-set");
    await envSetCommand.execute(...cliContext([EnvType.Prod]));

    expect(config.get("APP_ENV")).toBe(EnvType.Prod);

    resetConfig(config);
    envGetCommand = services.resolve("cli.command.env-get");
    await envGetCommand.execute(...cliContext());

    expect(config.get("APP_ENV")).toBe(EnvType.Prod);

    resetConfig(config);
    envSetCommand = services.resolve("cli.command.env-set");
    await envSetCommand.execute(...cliContext([EnvType.Dev]));

    expect(config.get("APP_ENV")).toBe(EnvType.Dev);

    resetConfig(config);
    envGetCommand = services.resolve("cli.command.env-get");
    await envGetCommand.execute(...cliContext());

    expect(config.get("APP_ENV")).toBe(EnvType.Dev);

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
    const {exitSpy, errorSpy} = spyOnCliError();
    const {} = spyOnCliSuccess(true);
    const services = createTestServices();
    const path = await establishSeparateEnvironmentForTesting(services, pool);
    const file = path + "/.env.local";

    services.register("cli.command.env-set", (): EnvSetCommand => {
        return new EnvSetCommand(
            services.resolve("cli.dependencies"),
            file
        );
    });

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
    command = services.resolve("cli.command.env-set");
    const writeVariablesMock = jest.spyOn(command as any, "writeVariables").mockImplementation(() => {
        throw new Error("Simulated write error");
    });
    await expect(command.execute(...cliContext([EnvType.Dev]))).rejects.toThrow(/^process\.exit 1$/);
    expect(exitSpy).nthCalledWith(5, 1);
    expect(errorSpy).nthCalledWith(5, expect.stringMatching(/could not be written/));
    await fs.promises.rm(file, {
        force: true,
        recursive: true
    });
    writeVariablesMock.mockRestore();
});