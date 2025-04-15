import CliCommand from "./CliCommand";
import Api from "../api/Api";
import ApiAction from "../api/action/ApiAction";
import {BeanContents, BeanProps} from "../datastructures/Bean";
import {ApiResponseContent} from "../api/action/response/ApiResponse";
import ApiActionParams from "../api/action/params/ApiActionParams";
import EmptyActionParams from "../api/action/params/EmptyActionParams";

class CliAction extends CliCommand
{
    protected static async do(...args)
    {
        const command = this.createAction(...args);
        if (!(command instanceof ApiAction))
        {
            this.error(`The 'prepareCommand' method returned an invalid command in '${this.name}'.`);
        }
        const result = await Api.executeCommand(command);
        this.output(`Status: ${result.status}`, true, false);
        this.output(result.toObject(), false);
    }

    static createAction(...args): ApiAction<any, any>
    {
        return null;
    }
}

function createCliCommand<
    TOptions extends BeanProps,
    TResponseContent extends ApiResponseContent,
    TActionParamsContent extends BeanContents
>(
    actionClass: new() => ApiAction<TResponseContent, TActionParamsContent>,
    actionParamsClass: new() => ApiActionParams<TActionParamsContent> = null,
    options: TOptions = null
): ApiAction<TResponseContent, TActionParamsContent>
{
    const action = new actionClass();
    if (actionParamsClass !== null && actionParamsClass !== EmptyActionParams && typeof options === "object")
    {
        const params = new actionParamsClass();
        params.bind(options);
        action.setParams(params);
    }

    return action;
}

export {createCliCommand};
export default CliAction;