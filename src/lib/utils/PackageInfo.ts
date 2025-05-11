import fs from "fs";
import path from "path";

export default class PackageInfo
{
    protected data: {[key:string]: any};

    public constructor(
        protected file: string = "../../../package.json"
    )
    {}

    protected async load(): Promise<void>
    {
        const file = path.resolve("./package.json");
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