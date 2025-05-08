import {DataFields, DataObject, IDataObject} from "./DataObject.js";

export abstract class DataEntity<TData extends DataObject> implements IDataObject
{
    private readonly dataObj: TData;

    public constructor(data: TData)
    {
        this.dataObj = data;
    }

    public bind(data: Partial<{dataObj: Partial<DataFields<TData>>} & DataFields<this>> & {dataObj?: Partial<DataFields<TData>>}): void
    {
        for (const key in data)
        {
            if (key === "dataObj" && typeof data.dataObj === "object")
            {
                this.dataObj.bind(data.dataObj);
            }
            else if (key in this && key !== "dataObj")
            {
                this[key] = data[key];
            }
        }
    }

    public data<Key extends keyof DataFields<TData>>(key?: Key): TData[Key]
    {
        return this.dataObj.get(key);
    }

    public toObject(): Record<string, any>
    {
        return this.dataObj.toObject();
    }

    public toJSON(): string
    {
        return JSON.stringify(this.toObject());
    }
}