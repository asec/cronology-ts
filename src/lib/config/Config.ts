import {configDotenv, DotenvPopulateInput} from "dotenv";

enum EnvType
{
    Prod = "prod",
    Dev = "dev",
    Test = "test"
}

class Config
{
    private data: DotenvPopulateInput = {};

    public constructor()
    {
        this.extendWith(".env");
    }

    public setEnvironment(env: EnvType)
    {
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

    public setEnvironmentToCli()
    {
        this.extendWith(".env.cli");
    }

    public extendWith(file: string)
    {
        this.extendConfiguration([file, file + ".local"])
    }

    private extendConfiguration(file: string[])
    {
        file.forEach(actualFile => {
            configDotenv({
                path: actualFile,
                override: true,
                processEnv: this.data
            });
        });
    }

    public get(key: string): string|undefined
    {
        return this.data[key];
    }

    private toggleLogging(state: boolean)
    {
        this.data["CONF_LOG_DISABLED"] = !state ? "true" : "false";
    }

    private toggleSilentLogging(state: boolean)
    {
        this.data["CONF_LOG_SILENT"] = state ? "true" : "false";
    }

    public enableLogging()
    {
        this.toggleLogging(true);
    }

    public disableLogging()
    {
        this.toggleLogging(false);
    }

    public enableSilentLogging()
    {
        this.toggleSilentLogging(true);
    }

    public disableSilentLogging()
    {
        this.toggleSilentLogging(false);
    }

    public isCurrentEnv(env: EnvType): boolean
    {
        return this.get("APP_ENV") === env;
    }
}

export { EnvType };
export default Config;