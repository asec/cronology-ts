import {expect, test} from "@jest/globals";
import PingAction from "../../../../../src/api/actions/ping/PingAction";
import EmptyActionParams from "../../../../../src/lib/api/action/params/EmptyActionParams";
import PingActionResponse, {
    PingActionResponseContent
} from "../../../../../src/api/actions/ping/response/PingActionResponse";
import Config, {EnvType} from "../../../../../src/lib/config/Config";
import {expectResponseToEqual} from "../../../_utils/api-response";
import {HttpStatus} from "../../../../../src/lib/api/Http";

Config.setEnvironment(EnvType.Test);

test("Action", async () => {
    const packageInfo = require("../../../../../package.json");
    const expectedOutputInTest: PingActionResponseContent = {
        success: true,
        version: `${packageInfo.version} (${EnvType.Test})`
    };
    const expectedOutputInProd: PingActionResponseContent = {
        success: true,
        version: `${packageInfo.version}`
    };

    const action = new PingAction();
    expect(() => action.setParams(new EmptyActionParams())).toThrow("not a constructor");

    let result = await action.execute();
    expect(result).toBeInstanceOf(PingActionResponse);
    expectResponseToEqual(result, expectedOutputInTest, HttpStatus.Ok);

    Config.setEnvironment(EnvType.Prod);
    result = await action.execute();
    expect(result).toBeInstanceOf(PingActionResponse);
    expectResponseToEqual(result, expectedOutputInProd, HttpStatus.Ok);
});