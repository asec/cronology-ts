import Application, {ApplicationData} from "../../../src/entities/Application";
import {DataFields} from "../../../src/lib/datastructures/DataObject";
import {testServices} from "../_services";
import * as fs from "fs";

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
    expect(app.data("uuid")).not.toBeUndefined();
    expect(app.data("uuid")).toHaveLength(36);
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
    expect(app.data("uuid")).not.toBeNull();
    expect(app.data("uuid")).toHaveLength(36);
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
    expect(app.data("uuid")).not.toBeNull();
    expect(app.data("uuid")).toHaveLength(36);
    expect(app.data("ip")).toHaveLength(2);
    expect(app.data("ip")).toStrictEqual(["e", "ip"]);
});

it("Generates some uuids", () => {
    const app = new Application(new ApplicationData());
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
    const app = createApp();
    app.inject(testServices);

    expect(await app.keys()).toHaveLength(0);
    await app.generateKeys();
    const keys = await app.keys();
    expect(keys).toHaveLength(2);

    const keysData = await Promise.all(
        keys.map(async (file) => (await fs.promises.readFile(file)).toString())
    );
    expect(keysData).toHaveLength(2);

    await expect(app.generateKeys()).rejects
        .toThrow(new RegExp(`regenerate rsa keys.*?already exists.*?${app.data("uuid")}`));

    await app.generateKeys(true);
    const newKeys = await app.keys();
    expect(keys).toStrictEqual(newKeys);
    const newKeysData  = await Promise.all(
        newKeys.map(async (file) => (await fs.promises.readFile(file)).toString())
    );
    expect(newKeysData).toHaveLength(2);
    expect(keysData[0]).not.toBe(newKeysData[0]);
    expect(keysData[1]).not.toBe(newKeysData[1]);

    const newApp = createApp({
        name: "test"
    });
    newApp.inject(testServices);
    await newApp.generateKeys();
    const newAppKeys = await newApp.keys();

    expect(newAppKeys).toHaveLength(2);
    expect(newAppKeys).not.toStrictEqual(keys);
    expect(newAppKeys).not.toStrictEqual(newKeys);
    const newAppKeysData = await Promise.all(
        newAppKeys.map(async (file) => (await fs.promises.readFile(file)).toString())
    );
    expect(newAppKeysData).toHaveLength(2);
    expect(newAppKeysData[0]).not.toBe(keysData[0]);
    expect(newAppKeysData[1]).not.toBe(keysData[1]);
    expect(newAppKeysData[0]).not.toBe(newKeysData[0]);
    expect(newAppKeysData[1]).not.toBe(newKeysData[1]);

    newKeys.map(keyName => keys.push(keyName));
    newAppKeys.map(keyName => keys.push(keyName));
    await Promise.all(keys.map(file => fs.promises.rm(file)));
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