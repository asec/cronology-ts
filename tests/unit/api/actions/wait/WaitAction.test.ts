import {expect, test} from "@jest/globals";
import WaitAction from "../../../../../src/api/actions/wait/WaitAction";
import WaitActionParams from "../../../../../src/api/actions/wait/params/WaitActionParams";
import {expectResponseToEqual} from "../../../_utils/api-response";
import {HttpStatus} from "../../../../../src/lib/api/Http";
import Profiler from "../../../../../src/lib/utils/Profiler";

test("Action", async () => {
    Profiler.start();
    const action = new WaitAction();
    await expect(action.execute()).rejects.toThrow();

    let params = new WaitActionParams();
    action.setParams(params);

    Profiler.mark();
    let result = await action.execute();
    expectResponseToEqual(result, {
        success: true,
        waited: 1000
    }, HttpStatus.Ok);
    expect(Profiler.get()).toBeGreaterThanOrEqual(1000);

    Profiler.mark();
    params = new WaitActionParams({
        ms: 5
    });
    action.setParams(params);
    result = await action.execute();
    expectResponseToEqual(result, {
        success: true,
        waited: 5
    });
    expect(Profiler.get()).toBeGreaterThanOrEqual(5);
});