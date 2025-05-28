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
    private envPaths: {[K in EnvType]: string} = {
        [EnvType.Prod]: "./",
        [EnvType.Dev]: "./",
        [EnvType.Test]: "./"
    };

    protected constructor(
        envPaths: Partial<{[K in EnvType]: string}> = {}
    )
    {
        for (let k in EnvType)
        {
            const type = EnvType[k];
            if (envPaths[type] !== undefined)
            {
                this.envPaths[type] = envPaths[type];
            }
        }
        this.reset();
    }

    public setEnvironment(env: EnvType)
    {
        switch (env)
        {
            case EnvType.Test:
                this.extendWith(this.envPaths[env] + ".env.test");
                break;
            case EnvType.Dev:
                this.extendWith(this.envPaths[env] + ".env.dev");
                break;
            default:
                this.extendWith(this.envPaths[env] + ".env");
        }
    }

    public setEnvironmentToCli()
    {
        this.extendWith(this.cliFile());
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

    public cliFile(): string
    {
        let cliFile: string = "";
        if (this.isCurrentEnv(EnvType.Test))
        {
            cliFile = this.envPaths[this.get("APP_ENV")] + ".env.cli.test";
        }
        else
        {
            cliFile = this.envPaths[this.get("APP_ENV")] + ".env.cli";
        }

        return cliFile;
    }

    public reset(): void
    {
        this.data = <TProps> {}
        this.extendWith(".env");
    }
}