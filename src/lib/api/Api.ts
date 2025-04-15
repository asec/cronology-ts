import ApiAction from "./action/ApiAction";
import ApiResponse, {ApiResponseContent} from "./action/response/ApiResponse";
import {BeanContents} from "../datastructures/Bean";
import {HttpMethod} from "./Http";
import ApiActionParams from "./action/params/ApiActionParams";

interface RouteData<TResponseContent extends ApiResponseContent, TParamsContent extends BeanContents>
{
    method: HttpMethod,
    commandClass: ApiAction<TResponseContent, TParamsContent>,
    paramsClass: ApiActionParams<TParamsContent>
}

interface Route<TResponseContent extends ApiResponseContent, TParamsContent extends BeanContents>
{
    [endpoint: string]: RouteData<TResponseContent, TParamsContent>[]
}

// Command pattern - Invoker
class Api
{
    protected static routes: Route<any, any>[] = [];

    public static addRoute<
        TResponseContent extends ApiResponseContent,
        TParamsContent extends BeanContents
    >(
        method: HttpMethod,
        endpoint: string,
        commandClass: new() => ApiAction<TResponseContent, TParamsContent>,
        paramsClass: new() => ApiActionParams<TParamsContent> = null
    )
    {
        if (typeof this.routes[endpoint] === "undefined")
        {
            this.routes[endpoint] = [];
        }

        this.routes[endpoint].push({
            method,
            commandClass,
            paramsClass
        });
    }

    public static getRoutes()
    {
        return this.routes;
    }

    public static async executeCommand<
        TResponseContent extends ApiResponseContent,
        TParamsContent extends BeanContents
    >(
        command: ApiAction<TResponseContent, TParamsContent>
    ): Promise<ApiResponse<TResponseContent>>
    {
        return command.execute();
    }
}

export default Api;