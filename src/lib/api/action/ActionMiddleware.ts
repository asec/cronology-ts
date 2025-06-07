import ApiResponse, {ApiResponseDTO} from "./response/ApiResponse.js";
import {ApiParamsDTO} from "./params/ApiActionParams.js";
import ApiAction from "./ApiAction.js";

type MiddlewareNextFunction = () => Promise<ApiResponse<ApiResponseDTO>> | ApiResponse<ApiResponseDTO>;

export default abstract class ActionMiddleware<TContext extends Record<string, any>, TAction extends ApiAction<ApiResponseDTO, ApiParamsDTO>>
{
    protected abstract validate(action: TAction, context: TContext): Promise<void>;
    protected abstract do(action: TAction, context: TContext, next: MiddlewareNextFunction): Promise<ApiResponse<ApiResponseDTO>> | ApiResponse<ApiResponseDTO>

    public async execute(
        action: TAction,
        context: TContext,
        next: MiddlewareNextFunction
    ): Promise<ApiResponse<ApiResponseDTO>>
    {
        await this.validate(action, context);

        return this.do(action, context, next);
    }
}