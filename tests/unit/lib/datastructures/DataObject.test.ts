import {it} from "@jest/globals";
import {DataFields, DataObject} from "../../../../src/lib/datastructures/DataObject";

it("Creates an empty data object", () => {
    const obj = new DataObject();
    expect(obj.toObject()).toStrictEqual({});
    expect(obj.toJSON()).toBe("{}");
});

it("Defines a data object and fills it with data", () => {
    class TestDO extends DataObject
    {
        public foo: string;
        public bar: number;
    }

    const obj = new TestDO();
    expect(obj.toObject()).toStrictEqual({});
    expect(obj.toJSON()).toBe("{}");

    const configObject: DataFields<TestDO> = {
        foo: "teszt",
        bar: 10
    };

    obj.bind(configObject);
    expect(obj.toObject()).toStrictEqual(configObject);
    expect(obj.toJSON()).not.toBe("{}");
});

it("Defines a data object with default values", () => {
    class TestDO extends DataObject
    {
        public foo: string = "teszt";
        public bar: number = 10;
        public baz: Date;
    }

    const obj = new TestDO();
    expect(obj.toObject()).toStrictEqual({
        foo: "teszt",
        bar: 10
    });
    expect(obj.toJSON()).toBe('{"foo":"teszt","bar":10}');
});