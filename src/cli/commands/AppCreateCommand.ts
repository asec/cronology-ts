import CliCommand from "../../lib/cli/CliCommand";
import ValidationError from "../../lib/error/ValidationError";
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
            "<name>",
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
        await this.validateName(name);

        const app = this.factory.create({
            name
        });

        this.output(`Creating application: '${app}'`, true, false);

        const repo = this.factory.repository();
        await repo.store(app);
        await app.generateKeys();

        this.output(`Created keys: \n\t${(await app.keys()).join("\n\t")}`, false);
    }

    private async validateName(name: string)
    {
        const regex = /^[a-z0-9_-]{3,}$/;
        const match = regex.exec(name);
        const repo = this.factory.repository();

        if (match === null)
        {
            throw new ValidationError(
                "Invalid argument: 'name'. Must be unique, must only contain lowercase letters, " +
                "numbers and the following symbols: '-', '_'. Must be at least 3 characters long."
            );
        }

        if ((await repo.getByKey("name", name)).size > 0)
        {
            throw new ValidationError(
                "Invalid argument: 'name'. Must be unique."
            );
        }
    }
}