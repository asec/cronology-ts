import Application, {ApplicationData} from "../../../src/entities/Application";
import {DataFields} from "../../../src/lib/datastructures/DataObject";
import {testServices} from "../../_services";
import {msgKeysGenerated} from "../../_mock/utils/RsaKeypair";

function createApp(data: Partial<DataFields<ApplicationData>> = null): Application
{
    const appData = new ApplicationData();
    if (data !== null)
    {
        appData.bind(data);
    }

    return new Application(appData);
}

it("Creates an entity with default values", async () => {
    const app = createApp();

    expect(app.data("name")).toBeUndefined();
    expect(app.data("uuid")).toBeUndefined();
    expect(app.data("ip")).toHaveLength(0);

    await expect(app.generateKeys()).rejects.toThrow(/no service container.*?'Application'.*?'inject'/);
});

it("Creates an entity with specified values and modifies it", () => {
    const app = createApp({
        uuid: "a",
        name: "b",
        ip: ["c"]
    });

    expect(app.data("name")).toBe("b");
    expect(app.data("uuid")).toBe("a");
    expect(app.data("ip")).toHaveLength(1);
    expect(app.data("ip")[0]).toBe("c");

    app.bind({
        dataObj: {
            uuid: undefined,
            name: undefined,
            ip: undefined
        }
    });

    expect(app.data("name")).toBeUndefined();
    expect(app.data("uuid")).toBeUndefined();
    expect(app.data("ip")).toBeUndefined();

    app.bind({
        dataObj: {
            ip: ["e"]
        }
    });

    app.bind({
        dataObj: {
            uuid: null,
            name: "name",
            ip: app.data("ip").concat("ip")
        }
    });

    expect(app.data("name")).toBe("name");
    expect(app.data("uuid")).toBeNull();
    expect(app.data("ip")).toHaveLength(2);
    expect(app.data("ip")).toStrictEqual(["e", "ip"]);
});

it("Tests automatic uuid generation", () => {
    const factory = testServices.resolve("factory.application");
    let app = factory.create();
    expect(app.data("uuid")).toHaveLength(36);
    let uuid = app.data("uuid");

    app.bind({
        dataObj: {
            uuid: null
        }
    });
    expect(app.data("uuid")).toHaveLength(36);
    expect(app.data("uuid")).not.toBe(uuid);
    uuid = app.data("uuid");

    app.bind({
        dataObj: {
            uuid: undefined
        }
    });
    expect(app.data("uuid")).toHaveLength(36);
    expect(app.data("uuid")).not.toBe(uuid);

    app.bind({
        dataObj: {
            uuid: "a"
        }
    });
    expect(app.data("uuid")).toBe("a");

    app.bind({
        dataObj: {
            uuid: ""
        }
    });
    expect(app.data("uuid")).toBe("");

    app = factory.create({
        uuid: "b"
    });
    expect(app.data("uuid")).toBe("b");

    app = factory.create({
        uuid: ""
    });
    expect(app.data("uuid")).toBe("");

    app = factory.create({
        uuid: null
    });
    expect(app.data("uuid")).toHaveLength(36);
});

it("Generates some uuids", () => {
    const app = testServices.resolve("factory.application").create();
    const testSize = 10;

    for (let i = 0; i < testSize; i++)
    {
        const lastUuid = app.data("uuid");
        app.generateUuid();

        expect(lastUuid).toHaveLength(36);
        expect(app.data("uuid")).toHaveLength(36);
        expect(app.data("uuid")).not.toBe(lastUuid);
    }
});

it("Tests app key generation", async () => {
    const logSpy = jest.spyOn(console, "log").mockImplementation();

    const app: Application = createApp();
    app.inject(testServices);

    const getKeyData: (keys: string[]) => Promise<string[]> = (() => {
        const keyData: {[key: string]: string} = {};

        return async (keys: string[]) => {
            return Promise.all(
                keys.map(async (file) => {
                    if (!keyData[file])
                    {
                        keyData[file] = String(Math.random())
                    }

                    return keyData[file];
                })
            );
        };
    })();

    expect(await app.keys()).toHaveLength(0);
    await app.generateKeys();
    const keys = await app.keys();
    expect(keys).toHaveLength(2);
    expect(logSpy).nthCalledWith(1, msgKeysGenerated(keys));

    const keysData = await getKeyData(keys);
    expect(keysData).toHaveLength(2);

    await expect(app.generateKeys()).rejects
        .toThrow(new RegExp(`regenerate rsa keys.*?already exists.*?${app.data("uuid")}`));

    await app.generateKeys(true);
    const newKeys = await app.keys();
    expect(keys).toStrictEqual(newKeys);
    expect(logSpy).nthCalledWith(2, msgKeysGenerated(newKeys));

    const newApp = createApp({
        name: "test"
    });
    newApp.inject(testServices);
    await newApp.generateKeys();
    const newAppKeys = await newApp.keys();

    expect(newAppKeys).toHaveLength(2);
    expect(newAppKeys).not.toStrictEqual(keys);
    expect(newAppKeys).not.toStrictEqual(newKeys);
    const newAppKeysData = await getKeyData(newAppKeys);
    expect(newAppKeysData).toHaveLength(2);
    expect(newAppKeysData[0]).not.toBe(keysData[0]);
    expect(newAppKeysData[1]).not.toBe(keysData[1]);
    expect(logSpy).nthCalledWith(3, msgKeysGenerated(newAppKeys));

    logSpy.mockRestore();
});

it("Test ip address handling", () => {
    const app = createApp({
        name: "test"
    });

    expect(app.data("ip")).toHaveLength(0);

    app.addIp("127.0.0.1");
    expect(app.data("ip")).toHaveLength(1);
    expect(app.data("ip")).toStrictEqual(["127.0.0.1"]);

    app.addIp("127.0.0.1");
    expect(app.data("ip")).toHaveLength(1);

    app.addIp("teszt");
    expect(app.data("ip")).toHaveLength(2);
    expect(app.data("ip")).toStrictEqual(["127.0.0.1", "teszt"]);

    app.addIp("::1");
    expect(app.data("ip")).toHaveLength(3);
    expect(app.data("ip")).toStrictEqual(["127.0.0.1", "teszt", "::1"]);

    app.removeIp("teszt");
    expect(app.data("ip")).toHaveLength(2);
    expect(app.data("ip")).toStrictEqual(["127.0.0.1", "::1"]);

    app.removeIp("foo");
    expect(app.data("ip")).toHaveLength(2);
    expect(app.data("ip")).toStrictEqual(["127.0.0.1", "::1"]);

    app.removeIp("127.0.0.1");
    app.removeIp("::1");
    expect(app.data("ip")).toHaveLength(0);
    expect(app.data("ip")).toStrictEqual([]);
});