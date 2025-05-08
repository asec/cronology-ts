import ApiResponse, {ApiResponseDTO} from "./response/ApiResponse.js";
import ApiActionParams, {ApiParamsDTO} from "./params/ApiActionParams.js";

// Command pattern - interface Command
interface Command<TResponseDTO extends ApiResponseDTO, TParamsDTO extends ApiParamsDTO>
{
    setParams(params: ApiActionParams<TParamsDTO>): void;
    execute(): Promise<ApiResponse<TResponseDTO>> | ApiResponse<TResponseDTO>;
}

export default abstract class ApiAction<TResponseDTO extends ApiResponseDTO, TParamsDTO extends ApiParamsDTO> implements Command<TResponseDTO, TParamsDTO>
{
    protected params: ApiActionParams<TParamsDTO>;

    public setParams(params: ApiActionParams<TParamsDTO>)
    {
        this.params = params;
    }

    public abstract execute(): Promise<ApiResponse<TResponseDTO>> | ApiResponse<TResponseDTO>;
}