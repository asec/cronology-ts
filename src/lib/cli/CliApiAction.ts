import CliCommand from "./CliCommand";
import ApiAction from "../api/action/ApiAction";
import {BeanContents, BeanProps} from "../datastructures/Bean";
import {ApiResponseContent} from "../api/action/response/ApiResponse";
import ApiActionParams from "../api/action/params/ApiActionParams";

export default abstract class CliApiAction extends CliCommand
{
    protected async do(...args)
    {
        const command = await this.createAction(...args);
        if (!(command instanceof ApiAction))
        {
            throw new Error(`The 'createAction' method returned an invalid command in '${this.constructor.name}'.`);
        }
        const result = await command.execute();

        this.output(`Status: ${result.status}`, true, false);
        this.output(result.toObject(), false);
    }

    protected async createCliCommand<TOptions extends BeanProps, TResponseContent extends ApiResponseContent, TActionParamsContent extends BeanContents>(
        action: ApiAction<TResponseContent, TActionParamsContent>,
        params: ApiActionParams<TActionParamsContent> = null,
        options: TOptions = null
    ): Promise<ApiAction<TResponseContent, TActionParamsContent>>
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

    protected abstract createAction(...args): Promise<ApiAction<any, any>>
}