import Bean, {BeanContents, BeanProps} from "../datastructures/Bean";
import {EntityKeyType} from "../entities/Entity";

type InferredBeanContents<T> = T extends Bean<infer U> ? U : BeanContents;
type BeanConstructor<TBean extends Bean<InferredBeanContents<TBean>>> = new (props?: InferredBeanContents<TBean>) => TBean;

export default interface IDatabase<TBean extends Bean<InferredBeanContents<TBean>>>
{
    store(beanClass: BeanConstructor<TBean>, object: TBean, index?: EntityKeyType): Promise<EntityKeyType>
    count(beanClass: BeanConstructor<TBean>): Promise<number>
    all(beanClass: BeanConstructor<TBean>): Promise<Map<EntityKeyType, TBean>>
    get(beanClass: BeanConstructor<TBean>, id: EntityKeyType): Promise<TBean|null>
    getByKey(beanClass: BeanConstructor<TBean>, key: keyof InferredBeanContents<TBean>, value: any): Promise<Map<EntityKeyType, TBean>>

    destruct(): Promise<void>
}