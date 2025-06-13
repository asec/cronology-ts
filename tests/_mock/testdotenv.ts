import {ServiceBindingsTestFull} from "../_services";
import ConnectionPool from "../../src/lib/utils/ConnectionPool";
import ServiceContainer from "../../src/lib/service/ServiceContainer";

type FileOptions = "copy"|"create"|"none"|"copy-none"|"copy-create";

export interface FileList
{
    ".env": FileOptions,
    ".env.local": FileOptions,
    ".env.dev": FileOptions,
    ".env.test": FileOptions
}

export async function establishSeparateEnvironmentForTesting(
    services: ServiceContainer<ServiceBindingsTestFull>,
    pool: ConnectionPool,
    fileList: Partial<FileList> = {
        ".env": "copy",
        ".env.dev": "copy",
        ".env.test": "copy"
    }
): Promise<string>
{
    const files = services.resolve("factory.testFile");
    pool.add(files);

    let path: string = null;
    for (let fileName in fileList)
    {
        const directive = fileList[fileName];
        const file = files.create(fileName);
        path = path || file.path();
        switch (directive)
        {
            case "copy":
                await file.copy(fileName);
                break;
            case "create":
                await file.create();
                break;
            case "copy-none":
                try
                {
                    await file.copy(fileName);
                }
                catch {}
                break;
            case "copy-create":
                try
                {
                    await file.copy(fileName);
                }
                catch
                {
                    await file.create();
                }
                break;
        }
    }

    services.resolve("config", path);

    return path;
}