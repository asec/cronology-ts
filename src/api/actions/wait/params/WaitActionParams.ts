import {BeanContents, BeanProps} from "../../../../lib/datastructures/Bean.js";
import ApiActionParams from "../../../../lib/api/action/params/ApiActionParams.js";
import ValidationError from "../../../../lib/error/ValidationError.js";

export interface WaitActionParamsContentRaw extends BeanProps
{
    ms?: unknown;
}

export class WaitActionParamsContent extends BeanContents
{
    public ms: number = 1000;
}

export default class WaitActionParams extends ApiActionParams<WaitActionParamsContent>
{
    public constructor(props?: WaitActionParamsContent)
    {
        super(WaitActionParamsContent, props);
    }

    public bind(props: WaitActionParamsContentRaw)
    {
        this.set("ms", Number(props.ms));
    }

    public async validate(): Promise<void>
    {
        if (this.get("ms") === null || this.get("ms") === undefined)
        {
            throw new ValidationError("Missing required parameter: 'ms'");
        }

        if (isNaN(this.get("ms")))
        {
            throw new ValidationError("Invalid parameter: 'ms'");
        }
    }
}