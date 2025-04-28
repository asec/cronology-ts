import ApiActionParams from "./ApiActionParams.js";
import {Request} from "express";

interface EmptyActionParamsContent extends Record<string, never>{}

class EmptyActionParams extends ApiActionParams<EmptyActionParamsContent>
{
    public constructor(props?: EmptyActionParamsContent)
    {
        super(null, props);
    }

    bind(props: {}): void {}

    parseRequest(req: Request<any, any, any, any, any>): void {}

    validate(): Promise<void> { return new Promise<void>(resolve => resolve()) }
}

export {EmptyActionParamsContent};
export default EmptyActionParams;