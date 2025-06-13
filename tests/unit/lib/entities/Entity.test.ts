import {DataObject} from "../../../../src/lib/datastructures/DataObject";
import Entity from "../../../../src/lib/entities/Entity";
import Factory from "../../../../src/lib/entities/Factory";
import ServiceContainer from "../../../../src/lib/service/ServiceContainer";
import {createTestServices} from "../../../_services";

it("Tests the cleanup method", async () => {
    class TestDO extends DataObject
    {
        public test: string;
    }

    class TestEntity extends Entity<TestDO>
    {}

    class TestFactory extends Factory<TestEntity>
    {
        constructor(services: ServiceContainer)
        {
            super(services);

            this.entityConstructor = TestEntity;
            this.dataObjectConstructor = TestDO;
        }
    }

    const services = createTestServices();
    const factory = new TestFactory(services);
    const repository = factory.repository();

    const entity = factory.create({
        test: "aaa"
    });
    const cleanupSpy = jest.spyOn(Object.getPrototypeOf(entity), "cleanup");

    const id = await repository.store(entity);
    expect(await repository.count()).toBe(1);
    expect(await repository.get(id)).not.toBe(entity);
    expect(await repository.get(id)).toStrictEqual(entity);

    await repository.delete(id);
    expect(await repository.count()).toBe(0);
    expect(await repository.get(id)).toBeNull();
    expect(cleanupSpy).toHaveBeenCalledTimes(1);
});