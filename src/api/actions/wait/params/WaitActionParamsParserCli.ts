import WaitActionParams, {WaitActionParamsDTO} from "./WaitActionParams.js";
import CliParamsParser, {CliContext} from "../../../../cli/middleware/CliParamsParser.js";

interface WaitCommandOptions extends Record<string, any>
{
    ms: string|number,
}

export default class WaitActionParamsParserCli extends CliParamsParser
{
    protected do(action, context: CliContext, next)
    {
        const options = (context.options as WaitCommandOptions);
        const data = new WaitActionParamsDTO();

        data.bind({
            ms: options.ms ? Number(options.ms) : data.get("ms")
        });

        action.setParams(new WaitActionParams(data));

        return next();
    }
}