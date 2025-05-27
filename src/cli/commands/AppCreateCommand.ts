import ApplicationFactory from "../../entities/factory/ApplicationFactory.js";
import CliCommand, {CliDependencies} from "../../lib/cli/CliCommand.js";
import ValidatorFactory from "../../lib/validation/ValidatorFactory.js";

export default class AppCreateCommand extends CliCommand
{
    public commandName = "app-create";
    public description = "Creates a new external application.";

    protected registerCliParams()
    {
        this.addArgument(
            "<app-name>",
            "The canonical name of the application. Must be unique, must only contain lowercase letters, " +
            "numbers and the following symbols: '-', '_'. Must be at least 3 characters long."
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

    protected async do(name: string)
    {
        const app = this.factory.create({
            name
        });

        const validator = this.validatorFactory.create("application", app);
        await validator.validate();

        this.output(`Creating application: '${app.data("name")}' (${app.data("uuid")})`, true, false);

        const repo = this.factory.repository();
        await repo.store(app);
        await app.generateKeys();

        this.output(`Created keys: \n\t${(await app.keys()).join("\n\t")}`, false);
    }
}