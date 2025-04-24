import ApiAction from "../../../lib/api/action/ApiAction.js";
import {EnvType} from "../../../lib/config/Config.js";
import PingActionResponse, {PingActionResponseContent} from "./response/PingActionResponse.js";
import {EmptyActionParamsContent} from "../../../lib/api/action/params/EmptyActionParams.js";
import AppConfig from "../../../config/AppConfig.js";
import PackageInfo from "../../../lib/utils/PackageInfo.js";

export default class PingAction extends ApiAction<PingActionResponseContent, EmptyActionParamsContent>
{
    public constructor(
        protected config: AppConfig,
        protected packageInfo: PackageInfo
    )
    {
        super();
    }

    public async execute(): Promise<PingActionResponse>
    {
        const response = new PingActionResponse();
        response.set("success", true);

        let version: string = await this.packageInfo.get("version") as string;
        if (!this.config.isCurrentEnv(EnvType.Prod))
        {
            version += ` (${this.config.get("APP_ENV")})`;
        }
        response.set("version", version);

        return response;
    }
}