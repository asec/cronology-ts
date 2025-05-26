import ApiActionParams, {ApiParamsDTO} from "../../../../lib/api/action/params/ApiActionParams.js";
import ValidationError from "../../../../lib/error/ValidationError.js";

export class WaitActionParamsDTO extends ApiParamsDTO
{
    public ms: number = 1000;
}

export default class WaitActionParams extends ApiActionParams<WaitActionParamsDTO>
{
    public validate(): Promise<void> | void
    {
        if (!this.data("ms") || this.data("ms") < 0)
        {
            throw new ValidationError("Invalid parameter: 'ms'. Needs to be a number greater than 0.");
        }

        if (this.data("ms") > 120000)
        {
            throw new ValidationError("Invalid parameter: 'ms'. Needs to be a number less than 120000.");
        }

        return null;
    }
}