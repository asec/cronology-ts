import RsaKeypair from "../../../src/lib/utils/RsaKeypair";

export function msgKeysGenerated(keys: string[])
{
    return `keys generated: ${keys.join("^")}`;
}

export default class RsaKeypair_test extends RsaKeypair
{
    protected generatePass: number = 0;
    protected keyNames: string[] = [];

    public async exists(): Promise<boolean>
    {
        return this.keyNames.length === 2;
    }

    public async generate(): Promise<void>
    {
        this.validate();

        this.generatePass++;
        this.keyNames = this.keys();

        console.log(msgKeysGenerated(this.keyNames));
    }
}