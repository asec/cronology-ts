import CliCommand, {CliDependencies} from "../../lib/cli/CliCommand.js";
import ApplicationFactory from "../../entities/factory/ApplicationFactory.js";

export default class AppDeleteCommand extends CliCommand
{
    public commandName = "app-delete";
    public description = "Deletes the application with the given name. This also removes the keys and any data " +
        "associated with the given application.";

    protected registerCliParams()
    {
        this.addArgument(
            "<app-name>",
            "The name of the application to be deleted"
        );
    }

    public constructor(
        dependencies: CliDependencies,
        protected factory: ApplicationFactory
    )
    {
        super(dependencies);
    }

    protected async do(name: string): Promise<void>
    {
        const [id, app] = await this.factory.repository().getOneByKey("name", name);
        if (app === null)
        {
            this.error(`The application does not exists: '${name}'`);
            return;
        }

        await this.factory.repository().delete(id);

        this.output(`Application deleted: ${app.data("name")} (${app.data("uuid")})`);
    }
}