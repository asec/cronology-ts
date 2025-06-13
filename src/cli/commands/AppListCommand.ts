import CliCommand, {CliDependencies} from "../../lib/cli/CliCommand.js";
import ApplicationFactory from "../../entities/factory/ApplicationFactory.js";

export default class AppListCommand extends CliCommand
{
    public commandName = "app-list";
    public description = "List all available application names.";

    public constructor(
        dependencies: CliDependencies,
        protected factory: ApplicationFactory
    )
    {
        super(dependencies);
    }

    protected async do(...args): Promise<void>
    {
        const apps = await this.factory.repository().all();
        const output = ["Applications available: "];

        if (apps.size === 0)
        {
            output.push(this.red("none"));
        }
        else
        {
            const appList = [];
            for (const [_, app] of apps)
            {
                appList.push(this.green(app.data("name")));
            }
            output.push(appList.join(", "));
        }

        await this.output(output.join(""));
    }
}
