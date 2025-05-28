import Entity from "./Entity.js";
import {DataFields, DataObject} from "../datastructures/DataObject.js";
import ServiceContainer from "../service/ServiceContainer.js";
import Repository from "./Repository.js";

type InferredDataObject<T> = T extends Entity<infer TDataObject> ? TDataObject : DataObject;

export default abstract class Factory<TEntity extends Entity<DataObject>>
{
    protected entityConstructor: new (data: InferredDataObject<TEntity>) => TEntity;
    protected dataObjectConstructor: new () => InferredDataObject<TEntity>;
    private _repository: Repository<TEntity>;

    protected constructor(
        protected services: ServiceContainer
    )
    {}

    public class(): new (data: InferredDataObject<TEntity>) => TEntity
    {
        return this.entityConstructor;
    }

    public create(data?: Partial<DataFields<InferredDataObject<TEntity>>>): TEntity
    {
        const dataObject = new this.dataObjectConstructor();
        if (data)
        {
            dataObject.bind(data);
        }

        const entity = new this.entityConstructor(dataObject);
        entity.inject(this.services);

        return entity;
    }

    public convert(data: Record<string, any>): TEntity
    {
        return this.create(data as Partial<DataFields<InferredDataObject<TEntity>>>);
    }

    public repository(): Repository<TEntity>
    {
        if (this._repository === undefined)
        {
            this._repository = this.services.resolve("repository", this) as Repository<TEntity>;
        }

        return this._repository;
    }
}