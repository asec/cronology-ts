import {BeanContents, BeanProps} from "../datastructures/Bean";
import ApiActionParams from "../api/action/params/ApiActionParams";

export default interface IExpressRequestParser<TParamsContent extends BeanContents>
{
    parse(): ApiActionParams<TParamsContent>
}