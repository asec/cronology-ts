import Entity from "../entities/Entity.js";
import {DataFields, DataObject} from "../datastructures/DataObject.js";
import Factory from "../entities/Factory.js";
import {EntityIdType} from "../entities/Repository.js";

export default interface IDatabase<TEntity extends Entity<DataObject>>
{
    store(factory: Factory<TEntity>, object: TEntity, id?: EntityIdType): Promise<EntityIdType>
    count(factory: Factory<TEntity>): Promise<number>
    all(factory: Factory<TEntity>): Promise<Map<EntityIdType, Record<string, any>>>
    get(factory: Factory<TEntity>, id: EntityIdType): Promise<Record<string, any>|null>
    getMoreByKey(factory: Factory<TEntity>, key: string, value: any): Promise<Map<EntityIdType, Record<string, any>>>
    getOneByKey(factory: Factory<TEntity>, key: string, value: any): Promise<[EntityIdType, Record<string, any>]|[null, null]>
}