import CliCommand, {CliDependencies} from "../../lib/cli/CliCommand.js";
import ApplicationFactory from "../../entities/factory/ApplicationFactory.js";
import ValidatorFactory from "../../lib/validation/ValidatorFactory.js";

interface AppIpCommandOptions
{
    add: string[]
    remove: string[]
}

export default class AppIpCommand extends CliCommand
{
    public commandName = "app-ip";
    public description = "Adds or removes whitelisted IP addresses for the given application.";

    protected registerCliParams()
    {
        this.addArgument(
            "<app-name>",
            "The name of the application to be modified"
        );

        this.addOption(
            "-a, --add <string>",
            "Adds the specified IP addresses to the whitelist",
            (val: string, acc: string[]|undefined) => {
                acc = acc ?? [];
                acc.push(val);

                return acc;
            }
        );

        this.addOption(
            "-r, --remove <string>",
            "Removes the specified IP addresses from the whitelist",
            (val: string, acc: string[]|undefined) => {
                acc = acc ?? [];
                acc.push(val);

                return acc;
            }
        );
    }

    public constructor(
        dependencies: CliDependencies,
        protected factory: ApplicationFactory,
        protected validatorFactory: ValidatorFactory
    )
    {
        super(dependencies);
    }

    protected async do(name: string, options: AppIpCommandOptions): Promise<void>
    {
        const [id, app] = await this.factory.repository().getOneByKey("name", name);
        if (app === null)
        {
            this.error(`The application does not exists: '${name}'`);
            return;
        }

        const validator = this.validatorFactory.create("application", app);

        if (options.add)
        {
            for (let i = 0; i < options.add.length; i++)
            {
                const ip = options.add[i];
                await validator.validateIp(ip);
                app.addIp(ip);
            }
        }

        if (options.remove)
        {
            for (let i = 0; i < options.remove.length; i++)
            {
                const ip = options.remove[i];
                app.removeIp(ip);
            }
        }

        if (options.add || options.remove)
        {
            await this.factory.repository().store(app, id);
        }

        const ips = (app.data("ip") ?? []).map(value => `\x1b[32m${value}\x1b[0m`);

        this.output(`Application: ${app.data("name")}`, true, false);
        this.output(`IPs whitelisted: ${ips.length === 0 ? '\x1b[31mnone\x1b[0m' : ips.join(", ")}`, false);
    }
}