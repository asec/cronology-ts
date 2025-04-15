import {test} from "@jest/globals";
import WaitActionParams, {
    WaitActionParamsContent, WaitActionRequest
} from "../../../../../../src/api/actions/wait/params/WaitActionParams";
import {expectBeanToEqual} from "../../../../_utils/bean";
import {mockRequest} from "../../../../_mock/request";

test("Instantiation", () => {
    const defaultProps: WaitActionParamsContent = {
        ms: 1000
    };
    const paramProps: WaitActionParamsContent = {
        ms: 65
    };

    let params = new WaitActionParams();
    expectBeanToEqual(params, defaultProps);

    params = new WaitActionParams(paramProps);
    expectBeanToEqual(params, paramProps);

    params = new WaitActionParams();
    params.bind({
        ms: String(paramProps.ms)
    });
    expectBeanToEqual(params, paramProps);

    let req = mockRequest<WaitActionRequest>("GET", "/wait", "::1");
    params = new WaitActionParams();
    params.parseRequest(req);
    expectBeanToEqual(params, defaultProps);

    req = mockRequest<WaitActionRequest>("GET", "/wait", "::1", {
        ms: "25"
    });
    params = new WaitActionParams();
    params.parseRequest(req);
    expectBeanToEqual(params, {
        ms: 25
    });
});