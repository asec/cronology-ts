import ApiAction from "../../../lib/api/action/ApiAction.js";
import AppDataActionResponse, {AppDataActionResponseContent} from "./response/AppDataActionResponse.js";
import {AppDataActionParamsContent} from "./params/AppDataActionParams.js";

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