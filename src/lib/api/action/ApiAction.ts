import ApiResponse, {ApiResponseDTO} from "./response/ApiResponse.js";
import ApiActionParams, {ApiParamsDTO} from "./params/ApiActionParams.js";
import CronologyError from "../../error/CronologyError.js";
import ActionMiddleware from "./ActionMiddleware.js";

// Command pattern - interface Command
interface Command<TResponseDTO extends ApiResponseDTO, TParamsDTO extends ApiParamsDTO>
{
    setParams(params: ApiActionParams<TParamsDTO>): void;
    execute(context: unknown): Promise<ApiResponse<TResponseDTO>> | ApiResponse<TResponseDTO>;
    use(middleware: ActionMiddleware<unknown, ApiAction<TResponseDTO, TParamsDTO>>): this;
}

export default abstract class ApiAction<TResponseDTO extends ApiResponseDTO, TParamsDTO extends ApiParamsDTO> implements Command<TResponseDTO, TParamsDTO>
{
    protected params: ApiActionParams<TParamsDTO>;
    protected middlewares: ActionMiddleware<unknown, this>[] = [];

    public setParams(params: ApiActionParams<TParamsDTO>)
    {
        this.params = params;
    }

    protected abstract do(): Promise<ApiResponse<TResponseDTO>> | ApiResponse<TResponseDTO>;

    public async execute(context: unknown): Promise<ApiResponse<TResponseDTO>>
    {
        let index = -1;
        const dispatch = async (i: number): Promise<ApiResponse<TResponseDTO>> => {
            if (i <= index)
            {
                throw new CronologyError(
                    `Middleware error in '${this.constructor.name}'. Function 'next()' is possibly called ` +
                    `multiple times`
                );
            }
            index = i;
            const middleware = this.middlewares[i];
            if (middleware)
            {
                return await middleware.execute(this, context, () => dispatch(i + 1)) as ApiResponse<TResponseDTO>;
            }

            return this.do();
        };

        return dispatch(0);
    }

    public use(middleware: ActionMiddleware<unknown, this>): this
    {
        this.middlewares.push(middleware);
        return this;
    }
}