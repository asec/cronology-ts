import {testServices} from "../../_services";
import EnvGetCommand from "../../../../src/cli/commands/EnvGetCommand";
import {cliContext} from "../../_mock/clicontext";
import * as fs from "fs";

afterEach(() => {
    jest.clearAllMocks();
});

it("Tests the basic command flow", async () => {
    const logSpy = jest.spyOn(console, "log")//.mockImplementation();
    jest.mock("fs");
    jest.spyOn(fs, "readFileSync").mockImplementation((filename, options): string => {
        console.log(filename, options);

        return "";
    });

    const command = testServices.resolve(EnvGetCommand);
    await command.execute(...cliContext());

    expect(logSpy).nthCalledWith(
        1,
        expect.stringMatching(/api-cli/),
        expect.stringMatching(/current CLI.*?test/),
        "\n"
    );
});