import {BeanContents} from "../datastructures/Bean";
import ApiActionParams from "../api/action/params/ApiActionParams";

export default interface IExpressRequestParser<TParamsContent extends BeanContents>
{
    parse(): Promise<ApiActionParams<TParamsContent>>
}