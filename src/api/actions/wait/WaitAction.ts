import ApiAction from "../../../lib/api/action/ApiAction";
import WaitActionParams, {WaitActionParamsContent} from "./params/WaitActionParams";
import WaitActionResponse, {WaitActionResponseContent} from "./response/WaitActionResponse";

class WaitAction extends ApiAction<WaitActionResponseContent, WaitActionParamsContent>
{
    public setParams(params: WaitActionParams)
    {
        super.setParams(params);
    }

    public async execute(): Promise<WaitActionResponse>
    {
        await new Promise(resolve => setTimeout(resolve, this.params.get("ms")));

        return new WaitActionResponse({
            success: true,
            waited: this.params.get("ms")
        });
    }
}

export default WaitAction;