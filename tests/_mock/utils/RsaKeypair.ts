import RsaKeypair from "../../../src/lib/utils/RsaKeypair";

interface RsaKey
{
    file: string
    value: string
}

export function msgKeysGenerated(keys: string[])
{
    return `keys generated: ${keys.join("^")}`;
}

export default class RsaKeypair_test extends RsaKeypair
{
    protected generatePass: number = 0;
    protected static keyNames = new Map<string, RsaKey[]>();

    public async exists(): Promise<boolean>
    {
        return RsaKeypair_test.keyNames.has(this.name);
    }

    public async generate(): Promise<void>
    {
        this.validate();

        this.generatePass++;
        const keys: RsaKey[] = [];
        for (let file of this.keys())
        {
            keys.push({
                file,
                value: String(Math.random())
            });
        }
        RsaKeypair_test.keyNames.set(this.name, keys);

        console.log(msgKeysGenerated(this.keys()));
    }

    public async delete(): Promise<void>
    {
        RsaKeypair_test.keyNames.delete(this.name);
    }

    public static keyValues(keys: string[]): string[]
    {
        const regex = /^.*[\\\/](.*)-(private|public).pem$/;
        const result: string[] = [];

        for (let i = 0; i < keys.length; i++)
        {
            const key = keys[i];
            const uuid = regex.exec(key);
            const keyData = RsaKeypair_test.keyNames.get(uuid[1]);
            for (let j = 0; j < keyData.length; j++)
            {
                const kd = keyData[j];
                if (kd.file === key)
                {
                    result.push(kd.value);
                    break;
                }
            }
        }

        return result;
    }
}