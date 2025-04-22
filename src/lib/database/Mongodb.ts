import Bean, {BeanContents, BeanProps} from "../datastructures/Bean";
import IDatabase from "./IDatabase";
import {EntityKeyType} from "../entities/Entity";
import {CreateIndexesOptions, Db, IndexSpecification, MongoClient, ObjectId} from "mongodb";
import BeanFactory from "../factory/BeanFactory";

type InferredBeanContents<T> = T extends Bean<infer U> ? U : BeanContents;
type BeanConstructor<TBean extends Bean<InferredBeanContents<TBean>>> = new (props?: BeanProps) => TBean;

export type BeanMapper = {[bean: string]: string};
export type IndexMapper = {[bean:string]: {spec: IndexSpecification, options: CreateIndexesOptions}[]};

export default class Mongodb<TBean extends Bean<InferredBeanContents<TBean>>> implements IDatabase<TBean>
{
    protected uri: string;
    protected dbName: string;

    protected client: MongoClient;
    protected db: Db;
    protected indicesCreated = new Map<BeanConstructor<any>, boolean>();

    public constructor(
        protected uriGenerator: () => string,
        protected dbNameGenerator: () => string,
        protected beanNameMapping: BeanMapper,
        protected indicesMapping: IndexMapper = {}
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
        }

        return this.db;
    }

    protected async collection(beanClass: BeanConstructor<TBean>)
    {
        if (!this.beanNameMapping.hasOwnProperty(beanClass.name))
        {
            throw new Error(
                `The following bean class has no collection name mapping in the mongodb driver: ` +
                `'${beanClass.name}'`
            );
        }

        await this.createIndices(beanClass);

        return this.db.collection(this.beanNameMapping[beanClass.name]);
    }

    protected async createIndices(beanClass: BeanConstructor<TBean>): Promise<void>
    {
        await this.connect();
        if (this.indicesCreated.has(beanClass))
        {
            return;
        }

        if (this.indicesMapping.hasOwnProperty(beanClass.name))
        {
            const indices = this.indicesMapping[beanClass.name];
            for (let i = 0; i < indices.length; i++)
            {
                const index = indices[i];
                await this.db.collection(this.beanNameMapping[beanClass.name]).createIndex(index.spec, index.options);
            }
        }

        this.indicesCreated.set(beanClass, true);
    }

    protected async disconnect()
    {
        if (this.client === undefined)
        {
            return;
        }

        await this.client.close();
        this.db = undefined;
    }

    public async store(factory: BeanFactory<TBean>, object: TBean, index?: EntityKeyType): Promise<EntityKeyType>
    {
        const db = await this.collection(factory.class());

        if (index === undefined)
        {
            const result = await db.insertOne(object.toObject());

            return result.insertedId.toString();
        }
        else
        {
            const result = await db.updateOne({
                _id: new ObjectId(index)
            }, {
                $set: object.toObject()
            });

            return index;
        }
    }

    public async all(factory: BeanFactory<TBean>): Promise<Map<EntityKeyType, TBean>>
    {
        const db = await this.collection(factory.class());

        const result = new Map<EntityKeyType, TBean>();
        const items = await db.find().toArray();
        for (let i = 0; i < items.length; i++)
        {
            const item = items[i];
            result.set(item._id.toString(), factory.convert(item));
        }

        return result;
    }

    public async count(factory: BeanFactory<TBean>): Promise<number>
    {
        const db = await this.collection(factory.class());

        return db.countDocuments();
    }

    public async get(factory: BeanFactory<TBean>, id: EntityKeyType): Promise<TBean|null>
    {
        const db = await this.collection(factory.class());

        const document = await db.findOne({
            _id: new ObjectId(id)
        });

        if (document === null)
        {
            return null;
        }

        return factory.convert(document);
    }

    public async getByKey(factory: BeanFactory<TBean>, key: keyof InferredBeanContents<TBean>, value: any): Promise<Map<EntityKeyType, TBean>>
    {
        const db = await this.collection(factory.class());

        const result = new Map<EntityKeyType, TBean>();
        const items = await db.find({
            [key]: value
        }).toArray();
        for (let i = 0; i < items.length; i++)
        {
            const item = items[i];
            result.set(item._id.toString(), factory.convert(item));
        }

        return result;
    }

    public async destruct(): Promise<void>
    {
        return this.disconnect();
    }
}