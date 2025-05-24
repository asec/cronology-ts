import {ServiceBindingsTestFull} from "../_services";
import ConnectionPool from "../../src/lib/utils/ConnectionPool";
import ServiceContainer from "../../src/lib/service/ServiceContainer";

interface FileList
{
    [key: string]: "copy"|"create"|"none"|"copy-none"|"copy-create"
}

export async function establishSeparateEnvironmentForTesting(
    services: ServiceContainer<ServiceBindingsTestFull>,
    pool: ConnectionPool
): Promise<void>
{
    const files = services.resolve("factory.testFile");
    pool.add(files);

    const fileList: FileList = {
        ".env": "copy",
        // ".env.local": "copy-none",
        ".env.dev": "copy",
        // ".env.dev.local": "copy-none",
        ".env.test": "copy",
        // ".env.test.local": "copy-none",
        ".env.cli.test": "copy",
        ".env.cli.test.local": "none"
    };

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

    services.resolve("config", {
        prod: path + "/",
        dev: path + "/",
        test: path + "/"
    });
}