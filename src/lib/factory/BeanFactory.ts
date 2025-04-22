import Bean, {BeanContents} from "../datastructures/Bean";
import ServiceContainer from "../service/ServiceContainer";
import Repository from "../entities/Repository";
import IDatabase from "../database/IDatabase";
import IValidator from "../validation/IValidator";

type InferredBeanContents<T> = T extends Bean<infer U> ? U : BeanContents;

export default abstract class BeanFactory<TBean extends Bean<InferredBeanContents<TBean>>>
{
    protected constructor(
        protected beanClass: new (props?: InferredBeanContents<TBean>) => TBean,
        protected repositoryClass: new (driver: IDatabase<TBean>) => Repository<TBean>,
        protected services: ServiceContainer
    )
    {}

    public create(props?: InferredBeanContents<TBean>): TBean
    {
        const bean = new this.beanClass(props);
        bean.inject(this.services);

        return bean;
    }

    public repository(): Repository<TBean>
    {
        return this.services.resolve(this.repositoryClass);
    }

    public abstract validator(entity: TBean): IValidator
}