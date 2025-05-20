import {IDisconnectable} from "../../src/lib/utils/ConnectionPool";
import TestFile from "./TestFile";
import {Uuid} from "../../src/lib/utils/Uuid";
import ServiceContainer from "../../src/lib/service/ServiceContainer";
import {ServiceBindingsTestFull} from "../_services";

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
        for (let i = 0; i < this.files.length; i++)
        {
            await this.files[i].delete();
        }

        return null;
    }
}