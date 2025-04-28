import ApiAction from "../../../lib/api/action/ApiAction.js";
import {WaitActionParamsContent} from "./params/WaitActionParams.js";
import WaitActionResponse, {WaitActionResponseContent} from "./response/WaitActionResponse.js";
import Profiler from "../../../lib/utils/Profiler.js";

export default class WaitAction extends ApiAction<WaitActionResponseContent, WaitActionParamsContent>
{
    public constructor(
        protected profiler: Profiler
    )
    {
        super();
    }

    public async execute(): Promise<WaitActionResponse>
    {
        await this.profiler.wait(this.params.get("ms"));

        return new WaitActionResponse({
            success: true,
            waited: this.params.get("ms")
        });
    }
}