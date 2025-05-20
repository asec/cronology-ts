import {testServices} from "../../../../_services";
import WaitActionParams, {WaitActionParamsDTO} from "../../../../../src/api/actions/wait/params/WaitActionParams";
import ApiResponse from "../../../../../src/lib/api/action/response/ApiResponse";
import {HttpStatus} from "../../../../../src/lib/api/Http";
import Profiler from "../../../../../src/lib/utils/Profiler";
import WaitActionParamsParserExpress from "../../../../../src/api/actions/wait/params/WaitActionParamsParserExpress";
import {ExpressContext} from "../../../../../src/api/middleware/ExpressRequestParser";
import {mockRequest} from "../../../../_mock/request";
import WaitActionResponseDTO from "../../../../../src/api/actions/wait/response/WaitActionResponse";
import WaitActionParamsParserCli from "../../../../../src/api/actions/wait/params/WaitActionParamsParserCli";
import {CliContext} from "../../../../../src/cli/middleware/CliParamsParser";

function _mockRequest(ms: unknown = null)
{
    return mockRequest("GET", "/wait", "::1", {
        ms
    });
}

function testResult(result: ApiResponse<WaitActionResponseDTO>, waitTime: number, profiler: Profiler)
{
    expect(result).toBeInstanceOf(ApiResponse);
    expect(result.status).toBe(HttpStatus.Ok);
    expect(result.data("success")).toBe(true);
    expect(result.data("waited")).toBe(waitTime);
    expect(profiler.get()).toBeGreaterThanOrEqual(waitTime - 3);
    expect(profiler.get()).toBeLessThanOrEqual(waitTime + 200);
    expect(profiler.get()).toBeLessThanOrEqual(waitTime * 3);
}

it("Runs the action with default parameters", async () => {
    const action = testServices.resolve("api.action.wait");

    await expect(action.execute(null)).rejects.toThrow(/requires parameters.*?'WaitAction'/);
});

it("Runs the action with manual parametrisation", async () => {
    const action = testServices.resolve("api.action.wait");
    const profiler = testServices.resolve("profiler");
    const defaultWaitTime: number = 1000;

    const params = new WaitActionParamsDTO();
    action.setParams(new WaitActionParams(params));
    profiler.mark();
    testResult(await action.execute(null), defaultWaitTime, profiler);

    let waitFor: number = 10;
    params.bind({
        ms: waitFor
    });
    profiler.mark();
    testResult(await action.execute(null), waitFor, profiler);

    params.bind({
        ms: -10
    });
    await expect(action.execute(null)).rejects.toThrow(/[iI]nvalid parameter.*?greater than/);
});

it("Runs the action with param parsing middleware on express context", async () => {
    const action = testServices.resolve("api.action.wait")
        .use(new WaitActionParamsParserExpress())
    ;
    const context = new ExpressContext();
    const profiler = testServices.resolve("profiler");
    const defaultWaitTime: number = 1000;

    await expect(action.execute(null)).rejects.toThrow(/context in middleware.*?'WaitActionParamsParserExpress'.*?'ExpressContext'/);

    context.bind({
        request: _mockRequest()
    });
    profiler.mark();
    testResult(await action.execute(context), defaultWaitTime, profiler);

    let waitFor: number = 30;
    context.bind({
        request: _mockRequest(waitFor)
    });
    profiler.mark();
    testResult(await action.execute(context), waitFor, profiler);

    context.bind({
        request: _mockRequest("10")
    });
    profiler.mark();
    testResult(await action.execute(context), 10, profiler);

    context.bind({
        request: _mockRequest("teszt")
    });
    await expect(action.execute(context)).rejects.toThrow(/[iI]nvalid parameter/);

    context.bind({
        request: _mockRequest("-10")
    });
    await expect(action.execute(context)).rejects.toThrow(/[iI]nvalid parameter/);
});

it("Runs the action with param parsing middleware on cli context", async () => {
    const action = testServices.resolve("api.action.wait")
        .use(new WaitActionParamsParserCli())
    ;
    const context = new CliContext<{ms?:any}>();
    const profiler = testServices.resolve("profiler");
    const defaultWaitTime: number = 1000;

    await expect(action.execute(null)).rejects.toThrow(/context in middleware.*?'WaitActionParamsParserCli'.*?'CliContext'/);

    profiler.mark();
    testResult(await action.execute(context), defaultWaitTime, profiler);

    context.bind({
        options: {
            ms: 10
        }
    });
    profiler.mark();
    testResult(await action.execute(context), 10, profiler);

    context.bind({
        options: {
            ms: "20"
        }
    });
    profiler.mark();
    testResult(await action.execute(context), 20, profiler);

    context.bind({
        options: {
            ms: "-10"
        }
    });
    await expect(action.execute(context)).rejects.toThrow(/[iI]nvalid parameter/);

    context.bind({
        options: {
            ms: "aaa"
        }
    });
    await expect(action.execute(context)).rejects.toThrow(/[iI]nvalid parameter/);
});