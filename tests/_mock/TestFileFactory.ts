import {IDisconnectable} from "../../src/lib/utils/ConnectionPool";
import TestFile from "./TestFile";
import {Uuid} from "../../src/lib/utils/Uuid";
import ServiceContainer from "../../src/lib/service/ServiceContainer";
import {ServiceBindingsTestFull} from "../_services";
import * as fs from "fs";

export default class TestFileFactory implements IDisconnectable
{
    private files: TestFile[] = [];
    private readonly uuid: string;

    public constructor(
        protected uuidGenerator: Uuid,
        protected services: ServiceContainer<ServiceBindingsTestFull>
    )
    {
        this.uuid = this.uuidGenerator();
    }

    public add(file: TestFile): void
    {
        this.files.push(file);
    }

    public create(fileName: string): TestFile
    {
        const file = this.services.resolve("testFile", fileName, this.uuid);
        this.add(file);

        return file;
    }

    public async disconnect(): Promise<void>
    {
        let path: string = null;
        const promises = [];
        for (let i = 0; i < this.files.length; i++)
        {
            path = path || this.files[i].path();
            promises.push(this.files[i].delete());
        }

        await Promise.all(promises);

        try
        {
            await fs.promises.access(path, fs.constants.R_OK);
            if ((await fs.promises.readdir(path)).length > 0)
            {
                console.error(`Uncleaned test files in ${path}`);
                await fs.promises.rm(path, {
                    force: true,
                    recursive: true
                });
            }
        }
        catch {}

        return null;
    }
}