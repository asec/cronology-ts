import ApiAction from "../../../lib/api/action/ApiAction";
import {WaitActionParamsContent} from "./params/WaitActionParams";
import WaitActionResponse, {WaitActionResponseContent} from "./response/WaitActionResponse";
import Profiler from "../../../lib/utils/Profiler";

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