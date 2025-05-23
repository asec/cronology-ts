import {testServices} from "../../../_services";
import PingAction from "../../../../../src/api/actions/ping/PingAction";
import PingActionResponseDTO from "../../../../../src/api/actions/ping/response/PingActionResponse";
import ApiResponse from "../../../../../src/lib/api/action/response/ApiResponse";
import Middleware from "../../../../../src/lib/api/action/Middleware";

class TestMiddleware extends Middleware<null, PingAction>
{
    public constructor(
        protected id: number
    )
    {
        super();
    }

    protected async validate(action: PingAction, context: null): Promise<void>
    {
        return null;
    }

    public async do(action: PingAction, context: null, next): Promise<ApiResponse<PingActionResponseDTO>>
    {
        console.log(`Before next #${this.id}`);
        const result = await next();
        console.log(`After next #${this.id}`);

        return result;
    }
}

class TestMiddlewareAsync extends TestMiddleware
{
    public async do(action: PingAction, context: null, next): Promise<ApiResponse<PingActionResponseDTO>>
    {
        await new Promise(resolve => setTimeout(() => { console.log(`Before next #${this.id}`); resolve(null)}, 10));
        const result = await next();
        await new Promise(resolve => setTimeout(() => { console.log(`After next #${this.id}`); resolve(null)}, 30));

        return result;
    }
}

async function testMiddlewareExecutionOrder(createTestMiddleware: (id: number) => Middleware<null, PingAction>)
{
    const logSpy = jest.spyOn(console, "log").mockImplementation();
    const action = testServices.resolve(PingAction);
    action
        .use(createTestMiddleware(0))
        .use(createTestMiddleware(1))
    ;

    const executeSpy = jest.spyOn(Object.getPrototypeOf(action), "do")
        .mockImplementation(async () => {
            console.log("-- Doing do --");

            const response = new PingActionResponseDTO();
            response.bind({
                success: true,
                version: "mocked"
            });
            return new ApiResponse(response);
        })
    ;

    const response = await action.execute(null);

    expect(logSpy).nthCalledWith(1, "Before next #0");
    expect(logSpy).nthCalledWith(2, "Before next #1");
    expect(logSpy).nthCalledWith(3, "-- Doing do --");
    expect(logSpy).nthCalledWith(4, "After next #1");
    expect(logSpy).nthCalledWith(5, "After next #0");
    expect(executeSpy).toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalledTimes(5);

    logSpy.mockRestore();
    executeSpy.mockRestore();

    expect(response.status).toBe(200);
    expect(response.data("success")).toBe(true);
    expect(response.data("version")).toBe("mocked");
}

it("Runs the action with default parameters",  async () => {
    const action = testServices.resolve(PingAction);
    const response = await action.execute(null);

    expect(response.status).toBe(200);
    expect(response.data("success")).toBe(true);
    expect(response.data("version")).toMatch(/^[0-9]+\.[0-9]+\.[0-9]+.*?test/);
});

it("Tests middleware execution", async () => {
    function createTestMiddleware(id: number): Middleware<null, PingAction>
    {
        return new TestMiddleware(id);
    }

    await testMiddlewareExecutionOrder(createTestMiddleware);
});

it("Tests middleware execution order using async middleware", async () => {
    const logSpy = jest.spyOn(console, "log").mockImplementation();

    function createTestMiddleware(id: number): Middleware<null, PingAction>
    {
        return new TestMiddlewareAsync(id);
    }

    await testMiddlewareExecutionOrder(createTestMiddleware);
});