import {expect, test} from "@jest/globals";
import PingActionResponse, {
    PingActionResponseContent
} from "../../../../../../src/api/actions/ping/response/PingActionResponse";
import {expectEmptyResponse, expectResponseToEqual} from "../../../../_utils/api-response";
import {HttpStatus} from "../../../../../../src/lib/api/Http";

test("Data", () => {
    const pingProps: PingActionResponseContent = {
        success: true,
        version: "aaa"
    };
    const pingPropsAlt: PingActionResponseContent = {
        success: false,
        version: ""
    };

    let result = new PingActionResponse();
    expectEmptyResponse(result);

    expect(result.set("success", pingPropsAlt.success)).toBe(true);
    expectResponseToEqual(result, {
        ...pingPropsAlt,
        version: undefined
    });

    result = new PingActionResponse();
    expect(result.set("version", pingPropsAlt.version)).toBe(true);
    expectResponseToEqual(result, {
        ...pingPropsAlt,
        success: undefined
    });

    result = new PingActionResponse(pingProps);
    expectResponseToEqual(result, pingProps);

    result = new PingActionResponse(pingPropsAlt, HttpStatus.Error);
    expectResponseToEqual(result, pingPropsAlt, HttpStatus.Error);
});