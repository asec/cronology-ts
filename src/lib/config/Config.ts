import {configDotenv} from "dotenv";

enum EnvType
{
    Prod = "prod",
    Dev = "dev",
    Test = "test"
}

class Config
{
    public static setEnvironment(env: EnvType)
    {
        this.extendWith(".env");
        switch (env)
        {
            case EnvType.Test:
                this.extendWith(".env.test");
                break;
            case EnvType.Dev:
                this.extendWith(".env.dev");
                break;
        }
    }

    public static setEnvironmentToCli()
    {
        this.extendWith(".env");
        this.extendWith(".env.cli");
    }

    public static extendWith(file: string)
    {
        this.extendConfiguration([file, file + ".local"])
    }

    private static extendConfiguration(file: string[])
    {
        file.forEach(actualFile => {
            configDotenv({
                path: actualFile,
                override: true
            });
        });
    }

    private static toggleLogging(state: boolean)
    {
        process.env.CONF_LOG_DISABLED = !state ? "true" : "false";
    }

    private static toggleSilentLogging(state: boolean)
    {
        process.env.CONF_LOG_SILENT = state ? "true" : "false";
    }

    public static enableLogging()
    {
        this.toggleLogging(true);
    }

    public static disableLogging()
    {
        this.toggleLogging(false);
    }

    public static enableSilentLogging()
    {
        this.toggleSilentLogging(true);
    }

    public static disableSilentLogging()
    {
        this.toggleSilentLogging(false);
    }

    public static isCurrentEnv(env: EnvType): boolean
    {
        return process.env.APP_ENV === env;
    }
}

export { EnvType };
export default Config;