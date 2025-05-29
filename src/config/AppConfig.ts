import Config, {ConfigProps, EnvType} from "../lib/config/Config.js";

export interface AppConfigProps extends ConfigProps
{
    APP_CLI_ENV: string;

    CONF_API_PORT: string;
    CONF_API_EXECUTION_TIMEOUT: string;
    CONF_API_USERSESSION_LENGTH: string;
    CONF_API_HTTPS_PRIVATEKEY: string;
    CONF_API_HTTPS_CERTIFICATE: string;
    CONF_API_HEADER_APP: string;
    CONF_API_HEADER_SIGNATURE: string;

    CONF_SCHEDULER_TICKRATE: string;

    CONF_DB_TYPE: string;
    CONF_MONGO_URI: string;
    CONF_MONGO_DB: string;
    CONF_MONGO_TABLE_APPLICATIONS: string;

    CONF_LOG_TYPE: "none" | "console" | "file";
    CONF_LOG_PROFILED: "true" | "false";
    CONF_LOG_FILE_DIR: string;

    CONF_CRYPTO_APPKEYS: string;
    CONF_CRYPTO_SIGNATURE_TIME_THRESHOLD: string;
}

export default class AppConfig extends Config<AppConfigProps>
{
    public constructor(
        envPaths: Partial<{[K in EnvType]: string}> = {}
    )
    {
        super(envPaths);
    }
}