import CliCommand, {CliDependencies} from "../../lib/cli/CliCommand.js";
import ApplicationFactory from "../../entities/factory/ApplicationFactory.js";

interface AppKeysCommandOptions
{
    recreate: boolean
}

export default class AppKeysCommand extends CliCommand
{
    public commandName = "app-keys";
    public description = "Shows or recreates the key files for the given application.";

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
        dependencies: CliDependencies,
        protected factory: ApplicationFactory
    )
    {
        super(dependencies);
    }

    protected async do(name: string, options: AppKeysCommandOptions): Promise<void>
    {
        const [_, app] = await this.factory.repository().getOneByKey("name", name);
        if (app === null)
        {
            await this.error(`The application does not exists: '${name}'`);
        }

        let keysGenerated: boolean = false;

        if (options.recreate)
        {
            await app.generateKeys(true);
            keysGenerated = true;
        }

        const keys = await app.keys();
        await this.output(`Application: '${app.data("name")}'`, true, false);
        if (keysGenerated)
        {
            await this.output("-- Keys have been regenerated --", false, false);
        }
        await this.output(`Keys: ${keys.length === 0 ? '\x1b[31mnone\x1b[0m' : ('\n\t' + keys.join("\n\t"))}`, false);
    }
}
