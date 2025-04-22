import IDatabase from "./IDatabase";
import Bean, {BeanContents, BeanProps} from "../datastructures/Bean";
import Entity, {EntityKeyType} from "../entities/Entity";

type InferredBeanContents<T> = T extends Bean<infer U> ? U : BeanContents;
type BeanConstructor<TBean extends Bean<InferredBeanContents<TBean>>> = new (props?: BeanProps) => TBean;

export default class Memory<TBean extends Bean<InferredBeanContents<TBean>>> implements IDatabase<TBean>
{
    protected data = new Map<EntityKeyType, Entity<TBean>>();

    protected copy(object: TBean): TBean
    {
        const constructor = <new (props: any) => TBean> object.constructor;
        return new constructor(JSON.parse(JSON.stringify(object.toObject())));
    }

    public async store(_: BeanConstructor<TBean>, object: TBean, index?: EntityKeyType): Promise<EntityKeyType>
    {
        const entity = new Entity(object);
        index = index ?? await this.count(_);

        this.data.set(index, entity);

        entity.set("_id", index);

        return index;
    }

    public async count(_: BeanConstructor<TBean>): Promise<number>
    {
        return this.data.size;
    }

    public async all(_: BeanConstructor<TBean>): Promise<Map<EntityKeyType, TBean>>
    {
        const result = new Map<EntityKeyType, TBean>();

        for (let [index, entity] of this.data.entries())
        {
            result.set(index, this.copy(entity.get("data")));
        }

        return result;
    }

    public async get(_: BeanConstructor<TBean>, index: EntityKeyType): Promise<TBean|null>
    {
        if (!this.data.has(index))
        {
            return null;
        }

        return this.copy(this.data.get(index).get("data"));
    }

    public async getByKey(_: BeanConstructor<TBean>, key: keyof InferredBeanContents<TBean>, value: any): Promise<Map<EntityKeyType, TBean>>
    {
        const result = new Map<EntityKeyType, TBean>();

        for (let [index, entity] of this.data.entries())
        {
            const object = entity.get("data");
            if (object.get(key) === undefined || object.get(key) !== value)
            {
                continue;
            }

            result.set(index, this.copy(object));
        }

        return result;
    }

    public destruct(): Promise<void>
    {
        return;
    }
}