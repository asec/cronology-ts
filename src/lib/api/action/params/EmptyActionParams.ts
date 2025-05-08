import ApiActionParams, {ApiParamsDTO} from "./ApiActionParams.js";

export class EmptyActionParamsDTO extends ApiParamsDTO
{}

export default class EmptyActionParams extends ApiActionParams<EmptyActionParamsDTO>
{
    public validate(): Promise<void> | void
    {}
}