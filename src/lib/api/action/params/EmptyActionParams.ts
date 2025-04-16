import ApiActionParams from "./ApiActionParams";
import {Request} from "express";
import {BeanContents, BeanProps} from "../../../datastructures/Bean";

interface EmptyActionParamsContent extends Record<string, never>{}

class EmptyActionParams extends ApiActionParams<EmptyActionParamsContent>
{
    public constructor(props?: EmptyActionParamsContent)
    {
        super(null, props);
    }

    bind(props: {}): void {}

    parseRequest(req: Request<any, any, any, any, any>): void {}

    validate(): void {}
}

export {EmptyActionParamsContent};
export default EmptyActionParams;