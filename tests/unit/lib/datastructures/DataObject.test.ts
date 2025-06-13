import {DataFields, DataObject} from "../../../../src/lib/datastructures/DataObject";

describe('DataObject', () => {
    describe('Basic functionality', () => {
        it("creates an empty data object", () => {
            const obj = new DataObject();
            expect(obj.toObject()).toStrictEqual({});
            expect(obj.toJSON()).toBe("{}");
        });

        it("defines a data object and fills it with data", () => {
            class TestDO extends DataObject {
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
            expect(obj.toJSON()).toBe('{"foo":"teszt","bar":10}');
        });

        it("defines a data object with default values", () => {
            class TestDO extends DataObject {
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
    });

    describe('get and set methods', () => {
        it("gets and sets property values correctly", () => {
            class TestDO extends DataObject {
                public foo: string = "initial";
                public bar: number = 5;
            }

            const obj = new TestDO();

            // Test get method
            expect(obj.get('foo')).toBe("initial");
            expect(obj.get('bar')).toBe(5);

            // Test set method
            obj.set('foo', "updated");
            obj.set('bar', 10);

            expect(obj.get('foo')).toBe("updated");
            expect(obj.get('bar')).toBe(10);
            expect(obj.toObject()).toStrictEqual({
                foo: "updated",
                bar: 10
            });
        });
    });

    describe('bind method', () => {
        it("binds only existing properties", () => {
            class TestDO extends DataObject {
                public foo: string;
                public bar: number;
            }

            const obj = new TestDO();
            obj.bind({
                foo: "test",
                bar: 20,
                // @ts-ignore - Testing runtime behavior with invalid property
                nonExistent: "should be ignored"
            });

            expect(obj.toObject()).toStrictEqual({
                foo: "test",
                bar: 20
            });
            expect(obj.toObject()['nonExistent']).toBeUndefined();
        });

        it("doesn't bind to function properties", () => {
            class TestDO extends DataObject {
                public foo: string;
                public customMethod(): string { return "method"; }
            }

            const obj = new TestDO();

            // Create a data object with the properties we want to test
            const data: any = {
                foo: "test",
                customMethod: "not a function anymore"
            };

            // Use the bind method to attempt to bind all properties
            obj.bind(data as Partial<DataFields<TestDO>>);

            // Verify that only non-function properties were bound
            expect(obj.toObject()).toStrictEqual({
                foo: "test"
            });

            // Verify that the function property was not changed
            expect(typeof obj.customMethod).toBe("function");
            expect(obj.customMethod()).toBe("method");
        });
    });

    describe('null and undefined handling', () => {
        it("excludes null and undefined values from toObject output", () => {
            class TestDO extends DataObject {
                public foo: string = "value";
                public nullProp: string = null;
                public undefinedProp: string = undefined;
            }

            const obj = new TestDO();
            const result = obj.toObject();

            expect(result).toStrictEqual({
                foo: "value"
            });
            expect('nullProp' in result).toBe(false);
            expect('undefinedProp' in result).toBe(false);
        });
    });

    describe('nested DataObjects', () => {
        it("handles nested DataObjects in toObject and toJSON", () => {
            class ChildDO extends DataObject {
                public childProp: string = "child value";
            }

            class ParentDO extends DataObject {
                public parentProp: string = "parent value";
                public child: ChildDO = new ChildDO();
            }

            const obj = new ParentDO();
            const objResult = obj.toObject();

            expect(objResult).toStrictEqual({
                parentProp: "parent value",
                child: {
                    childProp: "child value"
                }
            });

            expect(obj.toJSON()).toBe('{"parentProp":"parent value","child":{"childProp":"child value"}}');
        });

        it("handles deeply nested DataObjects", () => {
            class Level3DO extends DataObject {
                public level: number = 3;
            }

            class Level2DO extends DataObject {
                public level: number = 2;
                public child: Level3DO = new Level3DO();
            }

            class Level1DO extends DataObject {
                public level: number = 1;
                public child: Level2DO = new Level2DO();
            }

            const obj = new Level1DO();
            expect(obj.toObject()).toStrictEqual({
                level: 1,
                child: {
                    level: 2,
                    child: {
                        level: 3
                    }
                }
            });
        });
    });
});
