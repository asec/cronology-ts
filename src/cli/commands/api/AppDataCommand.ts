import CliApiAction from "../../../lib/cli/CliApiAction";
import AppDataAction from "../../../api/actions/app-data/AppDataAction";
import AppDataActionParams from "../../../api/actions/app-data/params/AppDataActionParams";

export default class AppDataCommand extends CliApiAction
{
    public commandName = "action:get-app-uuid";
    public description = "API action: GET /app/:uuid";

    protected registerCliParams()
    {
        this.addArgument(
            "<app-uuid>",
            "The uuid of the application you wish to see"
        );
    }

    protected createAction(uuid: string): Promise<AppDataAction>
    {
        const params = this.services.resolve(AppDataActionParams);
        params.bind({
            uuid
        });

        return this.createCliCommand(this.services.resolve(AppDataAction), params);
    }
}