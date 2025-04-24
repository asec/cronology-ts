import ApiAction from "../../../lib/api/action/ApiAction";
import AppDataActionResponse, {AppDataActionResponseContent} from "./response/AppDataActionResponse";
import {AppDataActionParamsContent} from "./params/AppDataActionParams";

export default class AppDataAction extends ApiAction<AppDataActionResponseContent, AppDataActionParamsContent>
{
    public async execute(): Promise<AppDataActionResponse>
    {
        const app = this.params.get("app");

        return new AppDataActionResponse({
            success: true,
            result: app.toObject()
        });
    }
}