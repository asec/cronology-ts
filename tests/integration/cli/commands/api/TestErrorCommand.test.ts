import {testServices} from "../../../../_services";
import {cliContext} from "../../../../_mock/clicontext";

afterEach(() => {
    jest.restoreAllMocks();
});

it("Tests the basic command flow", async () => {
    const exitSpy = jest.spyOn(process, "exit").mockImplementation((errorCode: unknown) => {
        throw new Error(`process.exit ${errorCode}`);
    });
    const logSpy = jest.spyOn(process.stderr, "write").mockImplementation();

    const command = testServices.resolve("cli.action.testError");
    await expect(command.execute(...cliContext())).rejects.toThrow(/^process\.exit 1$/);

    expect(exitSpy).nthCalledWith(1, 1);
    expect(logSpy).nthCalledWith(1, expect.stringMatching(/[Tt]eszt error/));
});