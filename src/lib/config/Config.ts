import {configDotenv} from "dotenv";

export enum EnvType
{
    Prod = "prod",
    Dev = "dev",
    Test = "test"
}

export interface ConfigProps
{
    [name: string]: string

    APP_ENV: string;
}

export interface IConfig
{}

export default abstract class Config<TProps extends ConfigProps> implements IConfig
{
    private data: TProps = <TProps> {};

    protected constructor()
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

    public get(key: keyof TProps): string|undefined
    {
        return this.data[key];
    }

    protected set<TKey extends keyof TProps>(key: TKey, value: TProps[TKey])
    {
        this.data[key] = value;
    }

    public isCurrentEnv(env: EnvType): boolean
    {
        return this.get("APP_ENV") === env;
    }
}