import ApiAction from "../../../lib/api/action/ApiAction.js";
import WaitActionResponseDTO from "./response/WaitActionResponse.js";
import {EmptyActionParamsDTO} from "../../../lib/api/action/params/EmptyActionParams.js";
import ApiResponse from "../../../lib/api/action/response/ApiResponse.js";
import Profiler from "../../../lib/utils/Profiler.js";

export default class WaitAction extends ApiAction<WaitActionResponseDTO, EmptyActionParamsDTO>
{
    public constructor(
        protected profiler: Profiler
    )
    {
        super();
    }

    public async execute(): Promise<ApiResponse<WaitActionResponseDTO>>
    {
        const waitLength = 1000;

        await this.profiler.wait(waitLength);

        const response = new WaitActionResponseDTO();
        response.bind({
            success: true,
            waited: waitLength
        });

        return new ApiResponse(response);
    }
}