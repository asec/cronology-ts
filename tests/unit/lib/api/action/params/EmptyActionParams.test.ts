import {expect, test} from "@jest/globals";
import EmptyActionParams from "../../../../../../src/lib/api/action/params/EmptyActionParams";

test("Instantiation: throw", () => {
    let params: EmptyActionParams;
    expect(() => params = new EmptyActionParams()).toThrow("not a constructor");
});