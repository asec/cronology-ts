import Bean, {BeanContents, BeanProps} from "../datastructures/Bean";
import ServiceContainer from "../service/ServiceContainer";
import Repository from "../entities/Repository";
import IDatabase from "../database/IDatabase";
import IValidator from "../validation/IValidator";

type InferredBeanContents<T> = T extends Bean<infer U> ? U : BeanContents;

export default abstract class BeanFactory<TBean extends Bean<InferredBeanContents<TBean>>>
{
    protected constructor(
        protected beanClass: new (props?: InferredBeanContents<TBean>) => TBean,
        protected repositoryClass: new (driver: IDatabase<TBean>, factory: BeanFactory<TBean>) => Repository<TBean>,
        protected services: ServiceContainer
    )
    {}

    public class(): new (props?: InferredBeanContents<TBean>) => TBean
    {
        return this.beanClass;
    }

    public create(props?: InferredBeanContents<TBean>): TBean
    {
        const bean = new this.beanClass(props);
        bean.inject(this.services);

        return bean;
    }

    public convert(props: BeanProps): TBean
    {
        return this.create(props as InferredBeanContents<TBean>);
    }

    public repository(): Repository<TBean>
    {
        return this.services.resolve(this.repositoryClass, {
            factory: this
        });
    }

    public abstract validator(entity: TBean): IValidator
}