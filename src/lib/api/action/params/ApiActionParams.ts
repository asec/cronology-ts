import Bean, {BeanContents, BeanProps} from "../../../datastructures/Bean.js";

export default abstract class ApiActionParams<TParamsContent extends BeanContents> extends Bean<TParamsContent>
{
    abstract bind(props: BeanProps): void;
    abstract validate(): Promise<void>;
}