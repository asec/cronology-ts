import AppConfig from "../../../src/config/AppConfig";
import {EnvType} from "../../../src/lib/config/Config";
import {createTestServices, testServices} from "../../_services";
import {establishSeparateEnvironmentForTesting} from "../../_mock/testdotenv";
import ConnectionPool from "../../../src/lib/utils/ConnectionPool";

const pool = new ConnectionPool();

afterAll(async () => {
    await pool.release();
});

it("Creates the default config", async () => {
    const services = createTestServices();
    const path = await establishSeparateEnvironmentForTesting(services, pool);

    const config = new AppConfig(path);
    expect(config.isCurrentEnv(EnvType.Prod)).toBe(true);

    const configFromService = services.resolve("config");
    expect(config.isCurrentEnv(EnvType.Prod)).toBe(true);
    expect(configFromService.getCurrentEnv()).toBe(EnvType.Test);
});

it("Tests environment changes", () => {
    const config = new AppConfig();

    config.setEnvironment(EnvType.Dev);
    expect(config.isCurrentEnv(EnvType.Prod)).toBe(false);
    expect(config.isCurrentEnv(EnvType.Dev)).toBe(true);

    config.setEnvironment(EnvType.Test);
    expect(config.isCurrentEnv(EnvType.Dev)).toBe(false);
    expect(config.isCurrentEnv(EnvType.Test)).toBe(true);
});

it("Tests the default environment of the config resolved from the container used by the tests", () => {
    const config = testServices.resolve("config");

    expect(config.isCurrentEnv(EnvType.Test)).toBe(true);
});