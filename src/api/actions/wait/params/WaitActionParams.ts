import {BeanContents, BeanProps} from "../../../../lib/datastructures/Bean";
import ApiActionParams from "../../../../lib/api/action/params/ApiActionParams";

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

    public validate(): void
    {
        if (this.get("ms") === null || this.get("ms") === undefined)
        {
            throw new Error("Missing required parameter: 'ms'");
        }

        if (isNaN(this.get("ms")))
        {
            throw new Error("Invalid parameter: 'ms'");
        }
    }
}