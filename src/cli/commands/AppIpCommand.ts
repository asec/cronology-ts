import CliCommand from "../../lib/cli/CliCommand.js";
import AppConfig from "../../config/AppConfig.js";
import {Command} from "commander";
import ServiceContainer from "../../lib/service/ServiceContainer.js";
import ApplicationFactory from "../../entities/factory/ApplicationFactory.js";

class AppIpOptions
{
    add: string[] = []
    remove: string[] = []
}

export default class AppIpCommand extends CliCommand
{
    public commandName = "app-ip";
    public description = "Adds or removes whitelisted IP addresses for the given application";

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
        config: AppConfig,
        program: Command,
        process: NodeJS.Process,
        services: ServiceContainer,
        protected factory: ApplicationFactory
    )
    {
        super(config, program, process, services);
    }

    protected async do(name: string, options: AppIpOptions): Promise<void>
    {
        const result = await this.factory.repository().getByKey("name", name);
        if (result.size !== 1)
        {
            this.error(`The application does not exists: '${name}'`);
            return;
        }

        const app = [...result.values()][0];
        const index = [...result.keys()][0];
        const validator = this.factory.validator(app);

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
                await validator.validateIp(ip);
                app.removeIp(ip);
            }
        }

        if (options.add || options.remove)
        {
            await this.factory.repository().store(app, index);
        }

        const ips = (app.get("ip") ?? []).map(value => `\x1b[32m${value}\x1b[0m`);

        this.output(`Application: ${app.get("name")}`, true, false);
        this.output(`IPs whitelisted: ${ips.length === 0 ? '\x1b[31mnone\x1b[0m' : ips.join(", ")}`, false);
    }


}