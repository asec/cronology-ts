import * as fs from "fs";
import * as path from "path";
import {Uuid} from "../../src/lib/utils/Uuid";

export default class TestFile
{
    public constructor(
        protected uuidGenerator: Uuid,
        protected _path: string,
        protected _file: string,
        protected uuid?: string
    )
    {
        if (this.uuid === undefined || this.uuid === null)
        {
            this.uuid = this.uuidGenerator();
        }
    }

    protected async doesBasePathExists(): Promise<boolean>
    {
        try
        {
            await fs.promises.access(this._path, fs.constants.W_OK | fs.constants.R_OK);
            return true;
        }
        catch
        {
            return false;
        }
    }

    protected async createBasePath()
    {
        await fs.promises.mkdir(this._path, {
            mode: 755,
            recursive: true
        });
    }

    protected async preparePath(): Promise<string>
    {
        if (!await this.doesBasePathExists())
        {
            await this.createBasePath();
        }

        const path = this._path + "/" + this.uuid;
        try
        {
            await fs.promises.access(path, fs.constants.W_OK | fs.constants.R_OK);
        }
        catch
        {
            await fs.promises.mkdir(path, {
                mode: 755,
                recursive: true
            });
        }

        return path;
    }

    public async create()
    {
        const path = await this.preparePath();

        await fs.promises.writeFile(path + "/" + this._file, "", {
            mode: 644
        });
    }

    public async copy(file: string)
    {
        const path = await this.preparePath();

        await fs.promises.access(file, fs.constants.R_OK);

        await fs.promises.cp(file, path + "/" + this._file);
    }

    public path(): string
    {
        return path.resolve(this._path + "/" + this.uuid);
    }

    public file(): string
    {
        return path.resolve(this._path + "/" + this.uuid + "/" + this._file);
    }

    public async delete()
    {
        const path = this._path + "/" + this.uuid;
        await fs.promises.rm(path + "/" + this._file);
        if ((await fs.promises.readdir(path)).length === 0)
        {
            await fs.promises.rm(path, {
                force: true,
                recursive: true
            });
        }
    }
}