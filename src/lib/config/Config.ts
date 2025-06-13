import {configDotenv} from "dotenv";
import CronologyError from "../error/CronologyError.js";

export enum EnvType
{
    Prod = "prod",
    Dev = "dev",
    Test = "test"
}

export interface ConfigProps
{
    // [name: string]: string

    APP_ENV: EnvType;
}

export interface IConfig
{}

export default abstract class Config<TProps extends ConfigProps> implements IConfig
{
    private data: TProps = <TProps & {[name: string]: string}> {};
    private readonly envPath: string = ".";

    protected constructor(
        envPath?: string
    )
    {
        if (envPath !== undefined)
        {
            this.envPath = envPath;
        }

        this.setEnvironment();
    }

    public setEnvironment(env?: EnvType)
    {
        this.reset();
        this.loadDefaultConfig();
        if (env === undefined)
        {
            this.extendWithEnvironment(this.getCurrentEnv());
        }
        else
        {
            this.extendWithEnvironment(env);
        }
    }

    private extendWithEnvironment(env: EnvType)
    {
        switch (env)
        {
            case EnvType.Test:
                this.extendWith(this.envPath + "/.env.test");
                break;
            case EnvType.Dev:
                this.extendWith(this.envPath + "/.env.dev");
                break;
            case EnvType.Prod:
                this.extendWith(this.envPath + "/.env");
                break;
            default:
                throw new CronologyError("Invalid value in config field 'APP_ENV'");
        }
    }

    private extendWith(file: string)
    {
        this.extendConfiguration([file, file + ".local"])
    }

    private extendConfiguration(file: string[])
    {
        file.forEach(actualFile => {
            configDotenv({
                path: actualFile,
                override: true,
                processEnv: <TProps & {[name: string]: string}> this.data
            });
        });
    }

    public get<Key extends keyof TProps>(key: Key): TProps[Key]|undefined
    {
        return this.data[key];
    }

    protected set<TKey extends keyof TProps>(key: TKey, value: TProps[TKey])
    {
        this.data[key] = value;
    }

    public isCurrentEnv(env: EnvType): boolean
    {
        return this.getCurrentEnv() === env;
    }

    public getCurrentEnv(): EnvType
    {
        return this.get("APP_ENV");
    }

    private reset(): void
    {
        this.data = <TProps> {};
    }

    private loadDefaultConfig(): void
    {
        if (Object.keys(this.data).length !== 0)
        {
            throw new CronologyError("You need to reset the configuration before loading the defaults.");
        }

        this.extendWith(this.envPath + "/.env");
    }
}