import Bean, {BeanContents} from "../datastructures/Bean";
import Entity, {EntityKeyType} from "./Entity";
import IDatabase from "../database/IDatabase";

type InferredBeanContents<T> = T extends Bean<infer U> ? U : BeanContents;
type BeanConstructor<TBean extends Bean<InferredBeanContents<TBean>>> = new (props?: InferredBeanContents<TBean>) => TBean;

export default abstract class Repository<TBean extends Bean<InferredBeanContents<TBean>>>
{
    protected beanClass: BeanConstructor<TBean>;

    public constructor(
        protected driver: IDatabase<TBean>
    )
    {
        this.initialise();
    }

    public async store(object: TBean): Promise<EntityKeyType>
    {
        return this.driver.store(this.beanClass, object);
    }

    public async count(): Promise<number>
    {
        return this.driver.count(this.beanClass);
    }

    public async all(): Promise<Map<EntityKeyType, TBean>>
    {
        return this.driver.all(this.beanClass);
    }

    public async get(id: EntityKeyType): Promise<TBean|null>
    {
        return this.driver.get(this.beanClass, id);
    }

    public async getByKey(key: keyof InferredBeanContents<TBean>, value: any): Promise<Map<EntityKeyType, TBean>>
    {
        return this.driver.getByKey(this.beanClass, key, value);
    }

    protected abstract initialise(): void
}