import Entity from "../entities/Entity.js";
import {DataFields, DataObject} from "../datastructures/DataObject.js";
import IDatabase from "./IDatabase.js";
import Factory from "../entities/Factory.js";
import {EntityIdType} from "../entities/Repository.js";
import CronologyError from "../error/CronologyError.js";

export default class Memorydb<TEntity extends Entity<DataObject>> implements IDatabase<TEntity>
{
    protected data = new Map<string, Map<EntityIdType, Record<string, any>>>;

    protected table(factory: Factory<TEntity>): Map<EntityIdType, Record<string, any>>
    {
        const className = factory.class().name;
        if (!this.data.has(className))
        {
            this.data.set(className, new Map<EntityIdType, Record<string, any>>());
        }

        return this.data.get(className);
    }

    protected copy(object: Record<string, any>): Record<string, any>
    {
        return JSON.parse(JSON.stringify(object));
    }

    public async count(factory: Factory<TEntity>): Promise<number>
    {
        return this.table(factory).size;
    }

    public async store(factory: Factory<TEntity>, object: TEntity, id?: EntityIdType): Promise<EntityIdType>
    {
        const hasId = (id !== undefined && id !== null);
        const nextKey = hasId ? id : await this.count(factory);
        const table = this.table(factory);

        if (hasId && !table.has(id))
        {
            throw new CronologyError(
                `Cannot update entity of type '${factory.class().name}' at id: '${id}', ` +
                `because there are no entities with that id.`
            );
        }

        table.set(nextKey, this.copy(object.toObject()));

        return nextKey;
    }

    public async all(factory: Factory<TEntity>): Promise<Map<EntityIdType, Record<string, any>>>
    {
        const data = new Map<EntityIdType, Record<string, any>>();
        for (let [id, object] of this.table(factory))
        {
            data.set(id, this.copy(object));
        }

        return data;
    }

    public async get(factory: Factory<TEntity>, id: EntityIdType): Promise<Record<string, any>|null>
    {
        const table = this.table(factory);
        if (!table.has(id))
        {
            return null;
        }

        return this.copy(table.get(id));
    }

    public async getMoreByKey(factory: Factory<TEntity>, key: string, value: any): Promise<Map<EntityIdType, Record<string, any>>>
    {
        const data = new Map<EntityIdType, Record<string, any>>();
        for (let [id, object] of this.table(factory).entries())
        {
            if (object[key] === undefined || object[key] !== value)
            {
                continue;
            }

            data.set(id, this.copy(object));
        }

        return data;
    }

    public async getOneByKey(factory: Factory<TEntity>, key: string, value: any): Promise<[EntityIdType, Record<string, any>]|[null, null]>
    {
        const result = [null, null] as [EntityIdType, Record<string, any>]|[null, null];
        for (let [id, object] of this.table(factory).entries())
        {
            if (object[key] === undefined || object[key] !== value)
            {
                continue;
            }

            result[0] = id;
            result[1] = this.copy(object);
            break;
        }

        return result;
    }
}