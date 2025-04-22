import Bean, {BeanContents, BeanProps} from "../datastructures/Bean";
import IDatabase from "./IDatabase";
import {EntityKeyType} from "../entities/Entity";
import {CreateIndexesOptions, Db, IndexSpecification, MongoClient, ObjectId} from "mongodb";

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

    protected collectionName: string;

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

        console.log(`indices created: ${beanClass.name}`);
        this.indicesCreated.set(beanClass, true);
    }

    protected async disconnect()
    {
        await this.client.close();
        this.db = undefined;
    }

    public async store(beanClass: BeanConstructor<TBean>, object: TBean): Promise<EntityKeyType>
    {
        const db = await this.collection(beanClass);

        const result = await db.insertOne(object.toObject());

        return result.insertedId.toString();
    }

    public async all(beanClass: BeanConstructor<TBean>): Promise<Map<EntityKeyType, TBean>>
    {
        const db = await this.collection(beanClass);

        const result = new Map<EntityKeyType, TBean>();
        const items = await db.find().toArray();
        for (let i = 0; i < items.length; i++)
        {
            const item = items[i];
            result.set(item._id.toString(), new beanClass(item));
        }

        return result;
    }

    public async count(beanClass: BeanConstructor<TBean>): Promise<number>
    {
        const db = await this.collection(beanClass);

        return db.countDocuments();
    }

    public async get(beanClass: BeanConstructor<TBean>, id: EntityKeyType): Promise<TBean|null>
    {
        const db = await this.collection(beanClass);

        const document = await db.findOne({
            _id: new ObjectId(id)
        });

        if (document === null)
        {
            return null;
        }

        return new beanClass(document);
    }

    public async getByKey(beanClass: BeanConstructor<TBean>, key: keyof InferredBeanContents<TBean>, value: any): Promise<Map<EntityKeyType, TBean>>
    {
        const db = await this.collection(beanClass);

        const result = new Map<EntityKeyType, TBean>();
        const items = await db.find({
            [key]: value
        }).toArray();
        for (let i = 0; i < items.length; i++)
        {
            const item = items[i];
            result.set(item._id.toString(), new beanClass(item));
        }

        return result;
    }

    public async destruct(): Promise<void>
    {
        return this.disconnect();
    }
}