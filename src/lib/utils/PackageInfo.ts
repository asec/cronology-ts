import fs from "fs";
import {fileURLToPath} from "url";

export default class PackageInfo
{
    protected data: {[key:string]: any};

    public constructor(
        protected file: string = "../../../package.json"
    )
    {}

    protected async load(): Promise<void>
    {
        const file = fileURLToPath(import.meta.resolve(this.file));
        this.data = JSON.parse(String(await fs.promises.readFile(file, "utf-8")));
    }

    public async get(key: string): Promise<unknown>
    {
        if (this.data === undefined)
        {
            await this.load();
        }

        return this.data[key];
    }
}