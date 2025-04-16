import ApiAction from "../../../lib/api/action/ApiAction";
import Config, {EnvType} from "../../../lib/config/Config";
import PingActionResponse, {PingActionResponseContent} from "./response/PingActionResponse";
import {EmptyActionParamsContent} from "../../../lib/api/action/params/EmptyActionParams";

export default class PingAction extends ApiAction<PingActionResponseContent, EmptyActionParamsContent>
{
    public constructor(
        protected config: Config
    )
    {
        super();
    }

    public async execute(): Promise<PingActionResponse>
    {
        const response = new PingActionResponse();
        response.set("success", true);

        const packageInfo = require(process.cwd() + "/package.json");
        let version = packageInfo.version;
        if (!this.config.isCurrentEnv(EnvType.Prod))
        {
            version += ` (${this.config.get("APP_ENV")})`;
        }
        response.set("version", version);

        return response;
    }
}