import Bean, {BeanContents} from "../../../src/lib/datastructures/Bean";
import {expect} from "@jest/globals";

export function expectEmptyBean(bean: Bean<any>) {
    expect(bean).toBeInstanceOf(Bean);
    expect(bean.toObject()).toEqual({});
    expect(bean.toString()).toBe("{}");
}

export function expectBeanToEqual<TContents extends BeanContents>(bean: Bean<TContents>, contents: TContents) {
    expect(bean).toBeInstanceOf(Bean);
    expect(bean.toObject()).toEqual(contents);
    expect(bean.toString()).toBe(JSON.stringify(contents));
}