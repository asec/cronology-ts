import {beforeEach, expect, jest, test} from '@jest/globals';
import Config, {EnvType} from "../../../../src/lib/config/Config";

const defaultEnvironmentVariables = {...process.env};

beforeEach(() => {
    jest.resetModules();
    process.env = {...defaultEnvironmentVariables};
});

test.each(Object.values(EnvType))("Environment: %s", (env: EnvType) => {
    expect(Config.isCurrentEnv(EnvType.Prod)).toBe(false);
    expect(Config.isCurrentEnv(EnvType.Dev)).toBe(false);
    expect(Config.isCurrentEnv(EnvType.Test)).toBe(false);
    expect(process.env.APP_ENV).toBeUndefined();
    Config.setEnvironment(env);
    expect(process.env.APP_ENV).toBe(env);
    expect(Config.isCurrentEnv(env)).toBe(true);
    expect(process.env.CONF_API_HTTPS_PRIVATEKEY).toBeDefined();
    expect(process.env.CONF_API_HTTPS_PRIVATEKEY).not.toBe("");
    expect(process.env.CONF_API_PORT).toBeDefined();
    expect(process.env.CONF_API_PORT).not.toBe("");

    Config.disableLogging();
    expect(process.env.CONF_LOG_DISABLED).toBe("true");
    Config.enableLogging();
    expect(process.env.CONF_LOG_DISABLED).toBe("false");

    Config.enableSilentLogging();
    expect(process.env.CONF_LOG_SILENT).toBe("true");
    Config.disableSilentLogging();
    expect(process.env.CONF_LOG_SILENT).toBe("false");
});

test("CLI environment", () => {
    expect(process.env.APP_CLI_ENV).toBeUndefined();
    Config.setEnvironment(EnvType.Prod);
    expect(process.env.APP_CLI_ENV).toBe("false");
    Config.setEnvironment(EnvType.Dev);
    expect(process.env.APP_CLI_ENV).toBe("false");
    Config.setEnvironment(EnvType.Test);
    expect(process.env.APP_CLI_ENV).toBe("false");

    Config.setEnvironmentToCli();
    expect(process.env.APP_CLI_ENV).toBe("true");
});