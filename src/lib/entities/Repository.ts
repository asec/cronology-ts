import {DataFields, DataObject} from "../datastructures/DataObject.js";
import Entity from "./Entity.js";
import Factory from "./Factory.js";
import IDatabase from "../database/IDatabase.js";

type InferredDataObject<T> = T extends Entity<infer TDataObject> ? TDataObject : DataObject;
export type EntityIdType = string|number;

export default class Repository<TEntity extends Entity<DataObject>>
{
    public constructor(
        protected factory: Factory<TEntity>,
        protected driver: IDatabase<TEntity>
    )
    {}

    public async store(object: TEntity, id?: EntityIdType): Promise<EntityIdType>
    {
        return this.driver.store(this.factory, object, id);
    }

    public async count(): Promise<number>
    {
        return this.driver.count(this.factory);
    }

    public async all(): Promise<Map<EntityIdType, TEntity>>
    {
        const result = await this.driver.all(this.factory);
        const data = new Map<EntityIdType, TEntity>();
        for (let [id, object] of result)
        {
            data.set(id, this.factory.convert(object));
        }

        return data;
    }

    public async get(id: EntityIdType): Promise<TEntity|null>
    {
        const result = await this.driver.get(this.factory, id);

        if (result === null)
        {
            return null;
        }

        return this.factory.convert(result);
    }

    public async getMoreByKey<
        Key extends keyof DataFields<InferredDataObject<TEntity>>
    >(
        key: Key,
        value: InferredDataObject<TEntity>[Key]
    ): Promise<Map<EntityIdType, TEntity>>
    {
        const result = await this.driver.getMoreByKey(this.factory, String(key), value);
        const data = new Map<EntityIdType, TEntity>();
        for (let [id, object] of result)
        {
            data.set(id, this.factory.convert(object));
        }

        return data;
    }

    public async getOneByKey<
        Key extends keyof DataFields<InferredDataObject<TEntity>>
    >(
        key: Key,
        value: InferredDataObject<TEntity>[Key]
    ): Promise<[EntityIdType, TEntity]|[null, null]>
    {
        const [id, object] = await this.driver.getOneByKey(this.factory, String(key), value);
        if (id === null)
        {
            return [null, null];
        }

        return [id, this.factory.convert(object)];
    }
}