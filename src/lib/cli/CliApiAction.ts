import CliCommand from "./CliCommand.js";
import ApiAction from "../api/action/ApiAction.js";
import {ApiResponseDTO} from "../api/action/response/ApiResponse.js";
import ApiActionParams, {ApiParamsDTO} from "../api/action/params/ApiActionParams.js";
import {Command} from "commander";
import {CliContext} from "../../cli/middleware/CliParamsParser.js";

export default abstract class CliApiAction extends CliCommand
{
    protected async do(...args)
    {
        const command = await this.createAction(...args);
        if (!(command instanceof ApiAction))
        {
            throw new Error(`The 'createAction' method returned an invalid command in '${this.constructor.name}'.`);
        }

        const commander: Command = args[args.length - 1];
        const context: CliContext = new CliContext();
        context.bind({
            args: commander.args,
            options: commander.opts()
        });
        const result = await command.execute(context);

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