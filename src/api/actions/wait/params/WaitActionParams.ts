import {BeanContents} from "../../../../lib/datastructures/Bean";
import {Request} from "express";
import WaitActionResponseContent from "../response/WaitActionResponse";
import ApiActionParams from "../../../../lib/api/action/params/ApiActionParams";

interface WaitActionParamsContentRaw extends Record<string, any>
{
    ms?: string;
}

class WaitActionParamsContent extends BeanContents
{
    public ms: number = 1000;
}

type WaitActionRequest = Request<{}, WaitActionResponseContent, {}, WaitActionParamsContentRaw>;

class WaitActionParams extends ApiActionParams<WaitActionParamsContent>
{
    public constructor(props?: WaitActionParamsContent)
    {
        super(WaitActionParamsContent, props);
    }

    public parseRequest(req: WaitActionRequest)
    {
        this.bind({
            ms: req.query.ms || "1000"
        });
    }

    public bind(props: WaitActionParamsContentRaw)
    {
        this.set("ms", Number(props.ms));
    }
}

export {WaitActionParamsContent, WaitActionRequest};
export default WaitActionParams;