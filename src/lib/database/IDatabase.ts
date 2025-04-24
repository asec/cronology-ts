import Bean, {BeanContents, BeanProps} from "../datastructures/Bean.js";
import {EntityKeyType} from "../entities/Entity.js";
import BeanFactory from "../factory/BeanFactory.js";

type InferredBeanContents<T> = T extends Bean<infer U> ? U : BeanContents;

export default interface IDatabase<TBean extends Bean<InferredBeanContents<TBean>>>
{
    store(factory: BeanFactory<TBean>, object: TBean, index?: EntityKeyType): Promise<EntityKeyType>
    count(factory: BeanFactory<TBean>): Promise<number>
    all(factory: BeanFactory<TBean>): Promise<Map<EntityKeyType, TBean>>
    get(factory: BeanFactory<TBean>, id: EntityKeyType): Promise<TBean|null>
    getByKey(factory: BeanFactory<TBean>, key: keyof InferredBeanContents<TBean>, value: any): Promise<Map<EntityKeyType, TBean>>

    destruct(): Promise<void>
}