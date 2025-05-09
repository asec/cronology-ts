import CliCommand from "./CliCommand.js";
import ApiAction from "../api/action/ApiAction.js";
import {ApiResponseDTO} from "../api/action/response/ApiResponse.js";
import ApiActionParams, {ApiParamsDTO} from "../api/action/params/ApiActionParams.js";

export default abstract class CliApiAction extends CliCommand
{
    protected async do(...args)
    {
        const command = await this.createAction(...args);
        if (!(command instanceof ApiAction))
        {
            throw new Error(`The 'createAction' method returned an invalid command in '${this.constructor.name}'.`);
        }
        const result = await command.execute(args);

        this.output(`Status: ${result.status}`, true, false);
        this.output(result.toObject(), false);
    }

    protected async createCliCommand<TOptions extends Record<string, any>, TResponseDTO extends ApiResponseDTO, TActionParamsDTO extends ApiParamsDTO>(
        action: ApiAction<TResponseDTO, TActionParamsDTO>,
        params: ApiActionParams<TActionParamsDTO> = null,
        options: TOptions = null
    ): Promise<ApiAction<TResponseDTO, TActionParamsDTO>>
    {
        if (params !== null)
        {
            if (options !== null)
            {
                params.bind(options);
            }
            await params.validate();
            action.setParams(params);
        }
        return action;
    }

    protected abstract createAction(...args): Promise<ApiAction<ApiResponseDTO, ApiParamsDTO>>
}