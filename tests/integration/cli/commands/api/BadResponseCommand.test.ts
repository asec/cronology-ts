import {testServices} from "../../../../_services";
import {cliContext} from "../../../../_mock/clicontext";

afterEach(() => {
    jest.restoreAllMocks();
});

it("Tests the basic command flow", async () => {
    const logSpy = jest.spyOn(console, "log").mockImplementation();

    const command = testServices.resolve("cli.action.badResponse");
    await command.execute(...cliContext());

    expect(logSpy).nthCalledWith(
        1,
        expect.stringMatching(/api-cli/),
        expect.stringMatching(/422/),
        ""
    );
    expect(logSpy).nthCalledWith(
        2,
        expect.stringMatching(/api-cli/),
        expect.objectContaining({
            success: false,
            error: expect.stringMatching(/invalid response/)
        }),
        "\n"
    );
});