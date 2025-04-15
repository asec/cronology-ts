type BeanProps = Record<string, any>;

class BeanContents implements BeanProps
{}

class Bean<ContentType extends BeanContents>
{
    protected data: ContentType;

    public constructor(c: new() => ContentType, props?: ContentType)
    {
        this.data = new c();
        if (typeof props === "object")
        {
            this.setAll(props);
        }
    }

    public set<Key extends keyof ContentType>(key: Key, value: ContentType[Key]): boolean
    {
        if (!this.data.hasOwnProperty(key))
        {
            return false;
        }

        this.data[key] = value;

        return true;
    }

    public get<Key extends keyof ContentType>(key: Key): ContentType[Key]
    {
        return this.data[key];
    }

    public setAll(props: ContentType): boolean
    {
        let success = true;
        for (let i in props)
        {
            if (!this.set(i, props[i]))
            {
                success = false;
            }
        }

        return success;
    }

    public toObject(): ContentType
    {
        const result = {...this.data};
        for (let i in result) {
            if (typeof result[i] === "undefined")
            {
                delete result[i];
            }
        }
        return result;
    }

    public toString(): string
    {
        return JSON.stringify(this.toObject());
    }
}

function bean<ContentType extends BeanContents>(c: new() => ContentType, props?: ContentType): Bean<ContentType>
{
    return new Bean<ContentType>(c, props);
}

export {BeanContents, BeanProps, bean};
export default Bean;