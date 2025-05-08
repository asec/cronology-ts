import ApiActionParams, {ApiParamsDTO} from "../api/action/params/ApiActionParams.js";

export default interface IExpressRequestParser<TParamsContent extends ApiParamsDTO>
{
    parse(): Promise<ApiActionParams<TParamsContent>>
}