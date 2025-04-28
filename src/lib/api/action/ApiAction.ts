import ApiResponse, {ApiResponseContent} from "./response/ApiResponse.js";
import {BeanContents} from "../../datastructures/Bean.js";
import ApiActionParams from "./params/ApiActionParams.js";

// Command pattern - interface Command
interface Command<TResponseContent extends ApiResponseContent, TParamsContent extends BeanContents>
{
    setParams(params: ApiActionParams<TParamsContent>): void;
    execute(): Promise<ApiResponse<TResponseContent>>;
}

export default abstract class ApiAction<TResponseContent extends ApiResponseContent, TParamsContent extends BeanContents> implements Command<TResponseContent, TParamsContent>
{
    protected params: ApiActionParams<TParamsContent>;

    public setParams(params: ApiActionParams<TParamsContent>)
    {
        this.params = params;
    }

    public abstract execute(): Promise<ApiResponse<TResponseContent>>;
}