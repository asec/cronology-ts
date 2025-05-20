import AppConfig from "../../../src/config/AppConfig";
import {EnvType} from "../../../src/lib/config/Config";
import {testServices} from "../../_services";

it("Creates the default config", () => {
    const config = new AppConfig();

    expect(config.isCurrentEnv(EnvType.Prod)).toBe(true);
    expect(config.get("APP_CLI_ENV")).toBe("false");
});

it("Tests environment changes", () => {
    const config = new AppConfig();

    config.setEnvironment(EnvType.Dev);
    expect(config.isCurrentEnv(EnvType.Prod)).toBe(false);
    expect(config.isCurrentEnv(EnvType.Dev)).toBe(true);

    config.setEnvironment(EnvType.Test);
    expect(config.isCurrentEnv(EnvType.Dev)).toBe(false);
    expect(config.isCurrentEnv(EnvType.Test)).toBe(true);

    expect(config.get("APP_CLI_ENV")).toBe("false");

    config.setEnvironmentToCli();
    expect(config.get("APP_CLI_ENV")).toBe("true");
});

it("Tests the default environment of the config resolved from the container used by the tests", () => {
    const config = testServices.resolve("config");

    expect(config.isCurrentEnv(EnvType.Test)).toBe(true);
    expect(config.get("APP_CLI_ENV")).toBe("false");
});