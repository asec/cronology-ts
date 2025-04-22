import CliCommand from "../../lib/cli/CliCommand";
import AppConfig from "../../config/AppConfig";
import {Command} from "commander";
import ServiceContainer from "../../lib/service/ServiceContainer";
import ApplicationFactory from "../../entities/factory/ApplicationFactory";

class AppKeysOptions
{
    recreate: boolean = false
}

export default class AppKeysCommand extends CliCommand
{
    public commandName = "app-keys";
    public description = "Shows or recreates the key files for the given application"

    protected registerCliParams()
    {
        this.addArgument(
            "<app-name>",
            "The name of the application to be shown / modified"
        );

        this.addOption(
            "-r, --recreate",
            "If set, the keys will be forcefully recreated"
        );
    }

    public constructor(
        config: AppConfig,
        program: Command,
        process: NodeJS.Process,
        services: ServiceContainer,
        protected factory: ApplicationFactory
    )
    {
        super(config, program, process, services);
    }

    protected async do(name: string, options: AppKeysOptions): Promise<void>
    {
        const result = await this.factory.repository().getByKey("name", name);
        if (result.size !== 1)
        {
            this.error(`The application does not exists: '${name}'`);
            return;
        }

        const app = [...result.values()][0];
        const keys = await app.keys();
        let keysGenerated = false;

        if (options.recreate)
        {
            await app.generateKeys(true);
            keysGenerated = true;
        }

        this.output(`Application: '${app.get("name")}'`, true, false);
        if (keysGenerated)
        {
            this.output("-- Keys have been regenerated --", false, false);
        }
        this.output(`Keys: \n\t${keys.length === 0 ? '\x1b[31mnone\x1b[0m' : keys.join("\n\t")}`, false);
    }
}