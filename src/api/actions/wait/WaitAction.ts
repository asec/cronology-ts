import ApiAction from "../../../lib/api/action/ApiAction.js";
import WaitActionResponseDTO from "./response/WaitActionResponse.js";
import ApiResponse from "../../../lib/api/action/response/ApiResponse.js";
import Profiler from "../../../lib/utils/Profiler.js";
import {WaitActionParamsDTO} from "./params/WaitActionParams.js";
import ValidationError from "../../../lib/error/ValidationError.js";

export default class WaitAction extends ApiAction<WaitActionResponseDTO, WaitActionParamsDTO>
{
    public constructor(
        protected profiler: Profiler
    )
    {
        super();
    }

    protected async validate(): Promise<void>
    {
        if (!this.params)
        {
            throw new ValidationError(`The following action requires parameters: '${this.constructor.name}'`);
        }

        await this.params.validate();
    }

    public async do(): Promise<ApiResponse<WaitActionResponseDTO>>
    {
        await this.validate();

        const waitLength = this.params.data("ms");

        await this.profiler.wait(waitLength);

        const response = new WaitActionResponseDTO();
        response.bind({
            success: true,
            waited: waitLength
        });

        return new ApiResponse(response);
    }
}