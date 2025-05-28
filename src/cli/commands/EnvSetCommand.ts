import CliCommand, {CliDependencies} from "../../lib/cli/CliCommand.js";
import {EnvType} from "../../lib/config/Config.js";
import path from "path";
import fs from "fs";
import {AppConfigProps} from "../../config/AppConfig.js";

class EnvSetCommand extends CliCommand
{
    public commandName = "cli-env-set";
    public description = `Sets the CLI environment to one of the following: ${Object.values(EnvType).join(", ")}.` +
        ` This affects (among other things possibly) which db it will use.`;

    protected localFileName: string;

    protected registerCliParams()
    {
        this.addArgument(
            "<env>",
            `The identifier of the environment to set. Possible values: ${Object.values(EnvType).join(", ")}.`
        );
    }

    protected envKeysToCopy: (keyof AppConfigProps)[] = [
        "APP_ENV",
        "CONF_MONGO_URI",
        "CONF_MONGO_DB",
        "CONF_CRYPTO_APPKEYS",
        "CONF_LOG_DIR",
    ];

    public constructor(
        dependencies: CliDependencies
    )
    {
        super(dependencies);
        this.localFileName = this.config.cliFile() + ".local";
    }

    protected initialise(env: EnvType)
    {}

    public async do(env: EnvType)
    {
        const possibleEnvValues = Object.values(EnvType);
        if (possibleEnvValues.indexOf(env) === -1)
        {
            this.error(`Invalid parameter: 'env'. The possible values are: ${Object.values(EnvType).join(", ")}.`);
        }

        this.config.setEnvironment(env);

        const variables = this.extractVariablesFromCurrentEnv();
        let content: string[] = [];

        if (!this.localFileExists())
        {
            for (let varName in variables)
            {
                content.push(this.makeVariableString(varName, variables[varName]));
            }
        }
        else
        {
            try
            {
                content = fs.readFileSync(this.getLocalFileName()).toString().split("\n");
            }
            catch (e: any)
            {
                this.error(`The target file exists but could not be read: ${this.getLocalFileName()}`);
            }

            const varsFound: string[] = [];
            content.forEach((line: string, index: number) => {
                for (let varName in variables)
                {
                    if (line.startsWith(`${varName}=`))
                    {
                        content[index] = this.makeVariableString(varName, variables[varName]);
                        varsFound.push(varName);
                        break;
                    }
                }
            });
            const varNames: string[] = Object.keys(variables);
            const nonExistentVars: string[] = varNames.filter(varName => varsFound.indexOf(varName) === -1);
            nonExistentVars.forEach(varName => {
                content.push(this.makeVariableString(varName, variables[varName]));
            });
        }

        try
        {
            this.writeVariables(content);
        }
        catch (e: any)
        {
            this.error(`The target file could not be written: ${this.getLocalFileName()}`);
        }

        this.output(
            `CLI environment set to \x1b[32m${env}\x1b[0m. The necessary environment variables have been copied` +
            ` / updated.`
        );
    }

    private getLocalFileName(): string
    {
        return path.resolve(this.localFileName);
    }

    private localFileExists(): boolean
    {
        return fs.existsSync(this.getLocalFileName());
    }

    private writeVariables(content: string[]): void
    {
        fs.writeFileSync(this.getLocalFileName(), content.join("\n"));
    }

    private extractVariablesFromCurrentEnv(): {[key: string]: string}
    {
        const keys = {};
        for (let i = 0; i < this.envKeysToCopy.length; i++)
        {
            const key = this.envKeysToCopy[i];
            const newValue = this.config.get(key);
            if (newValue === undefined)
            {
                throw new Error(`Invalid key or value in config: '${key}'`);
            }
            keys[key] = newValue;
        }
        return keys;
    }

    private makeVariableString(name: string, value: any): string
    {
        return `${name}=${value}`;
    }
}

export default EnvSetCommand;