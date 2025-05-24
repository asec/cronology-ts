import {testServices} from "../../../_services";
import {cliContext} from "../../../_mock/clicontext";

afterEach(() => {
    jest.clearAllMocks();
});

it("Tests the basic command flow", async () => {
    const logSpy = jest.spyOn(console, "log").mockImplementation();

    const command = testServices.resolve("cli.command.env-get");
    await command.execute(...cliContext());

    expect(logSpy).nthCalledWith(
        1,
        expect.stringMatching(/api-cli/),
        expect.stringMatching(/current CLI.*?test/),
        "\n"
    );
});