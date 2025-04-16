import Bean, {BeanContents, BeanProps} from "../../../datastructures/Bean";

export default abstract class ApiActionParams<TParamsContent extends BeanContents> extends Bean<TParamsContent>
{
    abstract bind(props: BeanProps): void;
    abstract validate(): void;
}