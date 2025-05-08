export interface IDataObject
{
    bind(data: Partial<DataFields<this>>): void;
    toObject(): Record<string, any>;
    toJSON(): string;
}

type NonFunctionProperties<T> = {
    [K in keyof T]: T[K] extends Function ? never : K
}[keyof T];

export type DataFields<T> = Pick<T, NonFunctionProperties<T>>;

export class DataObject implements IDataObject
{
    public bind(data: Partial<DataFields<this>>): void
    {
        for (const key in data)
        {
            if (!(key in data))
            {
                continue;
            }

            this[key] = data[key];
        }
    }

    public get<Key extends keyof DataFields<this>>(key: Key): this[Key]
    {
        return this[key];
    }

    public set<Key extends keyof DataFields<this>>(key: Key, value: this[Key]): void
    {
        this[key] = value;
    }

    public toObject(): Record<string, any>
    {
        const result = {...this} as Record<string, any>;
        for (let i in result)
        {
            if (typeof result[i] === "undefined" || result[i] === null)
            {
                delete result[i];
            }
            else if (result[i] instanceof DataObject)
            {
                result[i] = (<DataObject> result[i]).toObject();
            }
        }
        return result;
    }

    public toJSON(): string
    {
        return JSON.stringify(this.toObject());
    }
}