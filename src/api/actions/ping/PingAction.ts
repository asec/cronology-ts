import ApiAction from "../../../lib/api/action/ApiAction";
import Config, {EnvType} from "../../../lib/config/Config";
import PingActionResponse, {PingActionResponseContent} from "./response/PingActionResponse";
import {EmptyActionParamsContent} from "../../../lib/api/action/params/EmptyActionParams";

class PingAction extends ApiAction<PingActionResponseContent, EmptyActionParamsContent>
{
    public async execute(): Promise<PingActionResponse>
    {
        const response = new PingActionResponse();
        response.set("success", true);

        const packageInfo = require(process.cwd() + "/package.json");
        let version = packageInfo.version;
        if (!Config.isCurrentEnv(EnvType.Prod))
        {
            version += ` (${process.env.APP_ENV})`;
        }
        response.set("version", version);

        return response;
    }
}

export default PingAction;