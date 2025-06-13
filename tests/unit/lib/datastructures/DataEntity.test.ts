import {DataEntity} from "../../../../src/lib/datastructures/DataEntity";
import {DataObject} from "../../../../src/lib/datastructures/DataObject";

it("Tests the toJSON method", () => {
    class TestDO extends DataObject
    {
        public test: string = "test";
    }

    class TestEntity extends DataEntity<TestDO>
    {}

    const entity = new TestEntity(new TestDO());
    expect(entity.toObject()).toEqual({test: "test"});
    expect(entity.toJSON()).toEqual('{"test":"test"}');

    entity.bind({
        dataObj: {
            test: "test2"
        }
    });
    expect(entity.toObject()).toEqual({test: "test2"});
    expect(entity.toJSON()).toEqual('{"test":"test2"}');
});