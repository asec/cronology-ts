import Bean, {BeanContents} from "../datastructures/Bean";
import Entity, {EntityKeyType} from "./Entity";
import IDatabase from "../database/IDatabase";
import BeanFactory from "../factory/BeanFactory";

type InferredBeanContents<T> = T extends Bean<infer U> ? U : BeanContents;
type BeanConstructor<TBean extends Bean<InferredBeanContents<TBean>>> = new (props?: InferredBeanContents<TBean>) => TBean;

export default abstract class Repository<TBean extends Bean<InferredBeanContents<TBean>>>
{
    public constructor(
        protected driver: IDatabase<TBean>,
        protected factory: BeanFactory<TBean>
    )
    {}

    public async store(object: TBean, index?: EntityKeyType): Promise<EntityKeyType>
    {
        return this.driver.store(this.factory, object, index);
    }

    public async count(): Promise<number>
    {
        return this.driver.count(this.factory);
    }

    public async all(): Promise<Map<EntityKeyType, TBean>>
    {
        return this.driver.all(this.factory);
    }

    public async get(id: EntityKeyType): Promise<TBean|null>
    {
        return this.driver.get(this.factory, id);
    }

    public async getByKey(key: keyof InferredBeanContents<TBean>, value: any): Promise<Map<EntityKeyType, TBean>>
    {
        return this.driver.getByKey(this.factory, key, value);
    }
}