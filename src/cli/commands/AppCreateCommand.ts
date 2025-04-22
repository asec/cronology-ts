import CliCommand from "../../lib/cli/CliCommand";
import {Command} from "commander";
import AppConfig from "../../config/AppConfig";
import ServiceContainer from "../../lib/service/ServiceContainer";
import ApplicationFactory from "../../entities/factory/ApplicationFactory";

export default class AppCreateCommand extends CliCommand
{
    public commandName = "app-create";
    public description = "Creates a new external application";

    protected registerCliParams()
    {
        this.addArgument(
            "<app-name>",
            "The canonical name of the application. Must be unique, must only contain lowercase letters, " +
            "numbers and the following symbols: '-', '_'. Must be at least 3 characters long."
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

    protected async do(name: string)
    {
        const app = this.factory.create({
            name
        });
        const validator = this.factory.validator(app);
        await validator.validateName();

        this.output(`Creating application: '${app}'`, true, false);

        const repo = this.factory.repository();
        await repo.store(app);
        await app.generateKeys();

        this.output(`Created keys: \n\t${(await app.keys()).join("\n\t")}`, false);
    }
}