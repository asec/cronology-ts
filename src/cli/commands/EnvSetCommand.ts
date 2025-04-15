import CliCommand from "../../lib/cli/CliCommand";
import Config, {EnvType} from "../../lib/config/Config";
import path from "path";
import fs from "fs";

class EnvSetCommand extends CliCommand
{
    static
    {
        this.commandName = "cli-env-set";
        this.description  = `Sets the CLI environment to one of the following: ${Object.values(EnvType).join(", ")}.` +
            ` This affects (among other things possibly) which db it will use.`;

        this.addArgument(
            "<environment>",
            `The identifier of the environment to set. Possible values: ${Object.values(EnvType).join(", ")}.`
        );
    }

    protected static envKeysToCopy: string[] = [
        "APP_ENV",
        "CONF_DB_URI",
        "CONF_CRYPTO_APPKEYS",
        "CONF_LOG_DIR",
    ];

    public static doWithInitialization(env: EnvType)
    {
        const possibleEnvValues = Object.values(EnvType);
        if (possibleEnvValues.indexOf(env) === -1)
        {
            this.error(`Invalid parameter: 'env'. The possible values are: ${Object.values(EnvType).join(", ")}.`);
        }

        Config.setEnvironment(env);

        const variables = this.#extractVariablesFromCurrentEnv();
        let content: string[] = [];

        if (!this.#localFileExists())
        {
            for (let varName in variables)
            {
                content.push(this.#makeVariableString(varName, variables[varName]));
            }
        }
        else
        {
            try
            {
                content = fs.readFileSync(this.#getLocalFileName()).toString().split("\n");
            }
            catch (e: any)
            {
                this.error(`The target file exists but could not be read: ${this.#getLocalFileName()}`);
            }

            const varsFound: string[] = [];
            content.forEach((line: string, index: number) => {
                for (let varName in variables)
                {
                    if (line.startsWith(`${varName}=`))
                    {
                        content[index] = this.#makeVariableString(varName, variables[varName]);
                        varsFound.push(varName);
                        break;
                    }
                }
            });
            const varNames: string[] = Object.keys(variables);
            const nonExistentVars: string[] = varNames.filter(varName => varsFound.indexOf(varName) === -1);
            nonExistentVars.forEach(varName => {
                content.push(this.#makeVariableString(varName, variables[varName]));
            });
        }

        try
        {
            fs.writeFileSync(this.#getLocalFileName(), content.join("\n"));
        }
        catch (e: any)
        {
            this.error(`The target file could not be written: ${this.#getLocalFileName()}`);
        }

        this.output(
            `CLI environment set to \x1b[32m${env}\x1b[0m. The necessary environment variables have been copied` +
            ` / updated.`
        );
    }

    static #getLocalFileName(): string
    {
        return path.resolve("./.env.cli.local");
    }

    static #localFileExists(): boolean
    {
        return fs.existsSync(this.#getLocalFileName());
    }

    static #extractVariablesFromCurrentEnv(): {[key: string]: string}
    {
        const keys = {};
        for (let i = 0; i < this.envKeysToCopy.length; i++)
        {
            const key = this.envKeysToCopy[i];
            keys[key] = process.env[key];
        }
        return keys;
    }

    static #makeVariableString(name: string, value: any): string
    {
        return `${name}=${value}`;
    }
}

export default EnvSetCommand;