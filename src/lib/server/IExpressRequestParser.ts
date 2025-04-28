import {BeanContents} from "../datastructures/Bean.js";
import ApiActionParams from "../api/action/params/ApiActionParams.js";

export default interface IExpressRequestParser<TParamsContent extends BeanContents>
{
    parse(): Promise<ApiActionParams<TParamsContent>>
}