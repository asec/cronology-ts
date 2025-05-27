import IDatabase from "./IDatabase.js";
import Entity from "../entities/Entity.js";
import {DataObject} from "../datastructures/DataObject.js";
import {CreateIndexesOptions, Db, IndexSpecification, MongoClient, ObjectId} from "mongodb";
import Factory from "../entities/Factory.js";
import {EntityIdType} from "../entities/Repository.js";
import ConnectionPool, {IDisconnectable} from "../utils/ConnectionPool.js";

export type CollectionNameMapper = {
    [entity: string]: string
};
export type IndexMapper = {[bean:string]: {spec: IndexSpecification, options: CreateIndexesOptions}[]};

export default class Mongodb<TEntity extends Entity<DataObject>> implements IDatabase<TEntity>, IDisconnectable
{
    protected uri: string;
    protected dbName: string;

    protected client: MongoClient;
    protected db: Db;
    protected indicesCreated = new Map<string, boolean>();

    public constructor(
        protected uriGenerator: () => string,
        protected dbNameGenerator: () => string,
        protected connectionPool: ConnectionPool,
        protected collectionMapper: CollectionNameMapper,
        protected indexMapper: IndexMapper = {}
    )
    {}

    protected async connect(): Promise<Db>
    {
        if (this.db === undefined)
        {
            if (this.uri === undefined && this.dbName === undefined)
            {
                this.uri = this.uriGenerator();
                this.dbName = this.dbNameGenerator();
            }
            this.client = new MongoClient(this.uri);
            await this.client.connect();
            this.db = this.client.db(this.dbName);

            this.connectionPool.add(this);
        }

        return this.db;
    }

    public async disconnect(): Promise<void>
    {
        if (this.client === undefined)
        {
            return;
        }

        await this.client.close();
        this.db = undefined;
    }

    protected async collection(factory: Factory<TEntity>)
    {
        const className = factory.class().name;
        if (!this.collectionMapper.hasOwnProperty(className))
        {
            throw new Error(
                `The following entity has no collection name mapping in the mongodb driver: ` +
                `'${className}'`
            );
        }

        await this.createIndices(factory);

        return this.db.collection(this.collectionMapper[className]);
    }

    protected async createIndices(factory: Factory<TEntity>): Promise<void>
    {
        const className = factory.class().name;

        await this.connect();
        if (this.indicesCreated.has(className))
        {
            return;
        }

        if (this.indexMapper.hasOwnProperty(className))
        {
            const indices = this.indexMapper[className];
            for (let i = 0; i < indices.length; i++)
            {
                const index = indices[i];
                const collection = this.db.collection(this.collectionMapper[className]);
                await collection.createIndex(index.spec, index.options);
            }
        }

        this.indicesCreated.set(className, true);
    }

    public async count(factory: Factory<TEntity>): Promise<number>
    {
        const db = await this.collection(factory);

        return db.countDocuments();
    }

    public async store(factory: Factory<TEntity>, object: TEntity, id?: EntityIdType): Promise<EntityIdType>
    {
        const db = await this.collection(factory);

        if (id === undefined)
        {
            const result = await db.insertOne(object.toObject());

            return result.insertedId.toString();
        }
        else
        {
            const result = await db.updateOne({
                _id: new ObjectId(id)
            }, {
                $set: object.toObject()
            });

            return id;
        }
    }

    public async all(factory: Factory<TEntity>): Promise<Map<EntityIdType, Record<string, any>>>
    {
        const db = await this.collection(factory);

        const result = new Map<EntityIdType, Record<string, any>>();
        const items = await db.find().toArray();
        for (let i = 0; i < items.length; i++)
        {
            const item = items[i];
            result.set(item._id.toString(), item);
        }

        return result;
    }

    public async get(factory: Factory<TEntity>, id: EntityIdType): Promise<Record<string, any>|null>
    {
        const db = await this.collection(factory);

        const document = await db.findOne({
            _id: new ObjectId(id)
        });

        if (document === null)
        {
            return null;
        }

        return document;
    }

    public async getMoreByKey(factory: Factory<TEntity>, key: string, value: any): Promise<Map<EntityIdType, Record<string, any>>>
    {
        const db = await this.collection(factory);

        const result = new Map<EntityIdType, Record<string, any>>();
        const items = await db.find({
            [key]: value
        }).toArray();
        for (let i = 0; i < items.length; i++)
        {
            const item = items[i];
            result.set(item._id.toString(), item);
        }

        return result;
    }

    public async getOneByKey(factory: Factory<TEntity>, key: string, value: any): Promise<[EntityIdType, Record<string, any>]|[null, null]>
    {
        const db = await this.collection(factory);

        const item = await db.findOne({
            [key]: value
        });
        if (item === null)
        {
            return [null, null];
        }

        return [item._id.toString(), item];
    }

    public async delete(factory: Factory<TEntity>, id: EntityIdType): Promise<boolean>
    {
        const db = await this.collection(factory);

        const res = await db.deleteOne({
            _id: new ObjectId(id)
        });

        return res.deletedCount === 1;
    }
}