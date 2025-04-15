import {expect, test} from "@jest/globals";
import Bean, {bean, BeanContents} from "../../../../src/lib/datastructures/Bean";
import {expectBeanToEqual, expectEmptyBean} from "../../_utils/bean";

class TestBeanContentsBad extends BeanContents
{
    public foo: number;
    public bar: string;
}

class TestBeanContents extends BeanContents
{
    public foo: number = undefined;
    public bar: string = undefined;
}

test("Default: empty", () => {
    let result = new Bean(BeanContents);
    expectEmptyBean(result);

    result = bean(BeanContents);
    expectEmptyBean(result);

    result = new Bean(BeanContents, {
        foo: 10,
        bar: "baz"
    });
    expectEmptyBean(result);

    result = bean(BeanContents, {
        foo: 10,
        bar: "baz"
    });
    expectEmptyBean(result);

    expect(result.setAll({
        foo: 10,
        bar: "baz"
    })).toBe(false);
    expectEmptyBean(result);
});

test("Bad BeanContents type: empty", () => {
    const testBeanProps: TestBeanContentsBad = {
        foo: 10,
        bar: "baz"
    };
    let result = new Bean(TestBeanContentsBad);
    expectEmptyBean(result);

    result = bean(TestBeanContentsBad);
    expectEmptyBean(result);

    result = new Bean(TestBeanContentsBad, testBeanProps);
    expectEmptyBean(result);

    result = bean(TestBeanContentsBad, testBeanProps);
    expectEmptyBean(result);

    expect(result.set("foo", testBeanProps.foo)).toBe(false);
    expectEmptyBean(result);

    expect(result.set("bar", testBeanProps.bar)).toBe(false);
    expectEmptyBean(result);

    expect(result.get("foo")).toBeUndefined();
    expect(result.get("bar")).toBeUndefined();

    expect(result.setAll(testBeanProps)).toBe(false);
    expectEmptyBean(result);
});

test("TestBeanContents: non-empty", () => {
    const testBeanProps: TestBeanContents = {
        foo: 11,
        bar: "foo"
    };

    const testBeanPropsSecondary: TestBeanContents = {
        foo: 10,
        bar: "baz"
    };

    const testBeanPropsMore: TestBeanContents & { baz: any } = {
        foo: 12,
        bar: "test",
        baz: new Date()
    };

    let result = new Bean(TestBeanContents);
    expectEmptyBean(result);

    result = bean(TestBeanContents);
    expectEmptyBean(result);

    result = new Bean(TestBeanContents, testBeanProps);
    expectBeanToEqual(result, testBeanProps);

    result = bean(TestBeanContents, testBeanProps);
    expectBeanToEqual(result, testBeanProps);

    expect(result.set("foo", testBeanPropsSecondary.foo)).toBe(true);
    expectBeanToEqual(result, {
        ...testBeanProps,
        foo: testBeanPropsSecondary.foo
    });

    expect(result.set("bar", testBeanPropsSecondary.bar)).toBe(true);
    expectBeanToEqual(result, testBeanPropsSecondary);

    expect(result.setAll(testBeanProps)).toBe(true);
    expectBeanToEqual(result, testBeanProps);

    expect(result.setAll(testBeanPropsMore)).toBe(false);
    expectBeanToEqual(result, {
        foo: testBeanPropsMore.foo,
        bar: testBeanPropsMore.bar
    });
    expect(result.toObject()).not.toEqual(testBeanPropsMore);
    expect(result.toString()).not.toBe(JSON.stringify(testBeanPropsMore));
});