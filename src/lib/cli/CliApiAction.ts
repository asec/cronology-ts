import CliCommand from "./CliCommand";
import ApiAction from "../api/action/ApiAction";
import {BeanContents, BeanProps} from "../datastructures/Bean";
import {ApiResponseContent} from "../api/action/response/ApiResponse";
import ApiActionParams from "../api/action/params/ApiActionParams";
import Config from "../config/Config";
import ServiceContainer from "../service/ServiceContainer";
import {Command} from "commander";

export default abstract class CliApiAction extends CliCommand
{
    public constructor(
        protected config: Config,
        protected program: Command,
        protected process: NodeJS.Process,
        protected services: ServiceContainer
    )
    {
        super(config, program, process);
    }

    protected async do(...args)
    {
        const command = this.createAction(...args);
        if (!(command instanceof ApiAction))
        {
            throw new Error(`The 'createAction' method returned an invalid command in '${this.constructor.name}'.`);
        }
        const result = await command.execute();

        this.output(`Status: ${result.status}`, true, false);
        this.output(result.toObject(), false);
    }

    protected createCliCommand<TOptions extends BeanProps, TResponseContent extends ApiResponseContent, TActionParamsContent extends BeanContents>(
        action: ApiAction<TResponseContent, TActionParamsContent>,
        params: ApiActionParams<TActionParamsContent> = null,
        options: TOptions = null
    ): ApiAction<TResponseContent, TActionParamsContent>
    {
        if (params !== null)
        {
            if (options !== null)
            {
                params.bind(options);
                params.validate();
            }
            action.setParams(params);
        }
        return action;
    }

    protected abstract createAction(...args): ApiAction<any, any>
}