import ApplicationFactory from "../../../../src/entities/factory/ApplicationFactory";
import {testServices} from "../../_services";
import Application from "../../../../src/entities/Application";

it("Tests instantiation with default params", async () => {
    const factory = testServices.resolve(ApplicationFactory);

    const app = factory.convert({
        foo: "bar",
        baz: 12,
        get: "zzz"
    });

    expect(app.toObject().foo).toBeUndefined();
    expect(app.toObject().bar).toBeUndefined();
});

it("Tests the repository", async () => {
    const factory = testServices.resolve(ApplicationFactory);
    const repository = factory.repository();

    expect(await repository.count()).toBe(0);
    expect((await repository.all()).size).toBe(0);

    const app = factory.create({
        name: "test",
        uuid: "aaa",
        ip: ["bbb"]
    });

    let id = await repository.store(app);

    app.bind({
        dataObj: {
            name: "VALAMI"
        }
    });

    await repository.store(app, id);

    app.data("ip").push("aaaa");

    expect(await repository.count()).toBe(1);
    expect((await repository.all()).size).toBe(1);
    expect((await repository.all()).get(0).data("ip")).toStrictEqual(["bbb"]);

    await expect(repository.store(app, 6)).rejects.toThrow(/update entity.*?'Application'.*?'6'.*?no entities/);

    const app2 = await repository.get(id);
    app.bind({
        dataObj: {
            name: "tst"
        }
    });

    expect(app.data("name")).toBe("tst");
    expect(app2.data("name")).toBe("VALAMI");
    expect(app.data("ip")).toStrictEqual(["bbb", "aaaa"]);
    expect(app2.data("ip")).toStrictEqual(["bbb"]);

    await repository.store(factory.create({
        name: "VALAMI"
    }));
    await repository.store(factory.create());

    const result = Array.from((await repository.getMoreByKey("name", "VALAMI")).values());
    expect(result).toHaveLength(2);
    expect(result[0].data("name")).toBe(result[1].data("name"));
    expect(result[0].data("uuid")).not.toBe(result[1].data("uuid"));

    let entity: Application;

    [id, entity] = await repository.getOneByKey("name", null);
    expect(id).toBeNull();
    expect(entity).toBeNull();

    [id, entity] = await repository.getOneByKey("name", "VALAMI");
    expect(id).not.toBeNull();
    expect(entity.data("name")).toBe("VALAMI");

    [id, entity] = await repository.getOneByKey("uuid", app2.data("uuid"));
    expect(id).not.toBeNull();
    expect(entity.data("uuid")).toBe("aaa");
});