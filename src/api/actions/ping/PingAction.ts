import ApiAction from "../../../lib/api/action/ApiAction.js";
import {EnvType} from "../../../lib/config/Config.js";
import {EmptyActionParamsDTO} from "../../../lib/api/action/params/EmptyActionParams.js";
import AppConfig from "../../../config/AppConfig.js";
import PackageInfo from "../../../lib/utils/PackageInfo.js";
import PingActionResponseDTO from "./response/PingActionResponse.js";
import ApiResponse from "../../../lib/api/action/response/ApiResponse.js";

export default class PingAction extends ApiAction<PingActionResponseDTO, EmptyActionParamsDTO>
{
    public constructor(
        protected config: AppConfig,
        protected packageInfo: PackageInfo
    )
    {
        super();
    }

    protected async do(): Promise<ApiResponse<PingActionResponseDTO>>
    {
        const response = new PingActionResponseDTO();

        let version: string = await this.packageInfo.get("version") as string;
        if (!this.config.isCurrentEnv(EnvType.Prod))
        {
            version += ` (${this.config.get("APP_ENV")})`;
        }

        response.bind({
            success: true,
            version
        });

        return new ApiResponse(response);
    }
}