import {createTestServices, testServices} from "../../../../_services";
import {cliContext} from "../../../../_mock/clicontext";
import PingAction from "../../../../../src/api/actions/ping/PingAction";
import {CliContext} from "../../../../../src/cli/middleware/CliParamsParser";
import PackageInfo from "../../../../../src/lib/utils/PackageInfo";

afterEach(() => {
    jest.restoreAllMocks();
});

it("Instantiates the action and runs it", async () => {
    const logSpy = jest.spyOn(console, "log").mockImplementation();
    const command = testServices.resolve("cli.action.ping");

    await command.execute(...cliContext());

    expect(logSpy).nthCalledWith(
        1,
        expect.stringMatching(/api-cli/),
        expect.stringMatching(/[Ss]tatus.*?200/),
        ""
    );
    expect(logSpy).nthCalledWith(
        2,
        expect.stringMatching(/api-cli/),
        expect.objectContaining({
            success: true,
            version: expect.stringMatching(/^[0-9]+\.[0-9]+\.[0-9]+.*?test/)
        }),
        "\n"
    );
});

it("Checks if the returned action is correct", async () => {
    const command = testServices.resolve("cli.action.ping");
    const action = await command["createAction"]();
    expect(action).toBeInstanceOf(PingAction);

    const executeSpy = jest.spyOn(action, "execute");
    // @ts-ignore - Spying on a protected property
    const doSpy = jest.spyOn(action, "do");

    const contextData = cliContext().pop();
    const context = new CliContext();
    context.bind({
        args: contextData["args"],
        options: contextData["opts"]()
    });

    await action.execute(context);

    expect(executeSpy).toHaveBeenCalledTimes(1);
    expect(doSpy).toHaveBeenCalledTimes(1);
});

it("Checks error handling", async () => {
    const services = createTestServices();
    services.register("packageInfo", () => new PackageInfo(".non-existent-file"));

    const exitSpy = jest.spyOn(process, "exit").mockImplementation();
    const errorSpy = jest.spyOn(process.stderr, "write").mockImplementation();
    const command = services.resolve("cli.action.ping");

    await command.execute(...cliContext());
    expect(exitSpy).toHaveBeenCalledWith(1);
    expect(errorSpy).nthCalledWith(1, expect.stringMatching(/no such file/));
});