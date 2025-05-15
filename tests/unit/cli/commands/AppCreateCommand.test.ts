import {testServices} from "../../_services";
import AppCreateCommand from "../../../../src/cli/commands/AppCreateCommand";
import {msgKeysGenerated} from "../../_mock/utils/RsaKeypair";

it("Instantiates and runs the command", async () => {
    const logSpy = jest.spyOn(console, "log").mockImplementation();
    const exitSpy = jest.spyOn(process, "exit").mockImplementation((code?: number): never => {
        throw new Error(`process exit ${code}`);
    });
    const stdErrSpy = jest.spyOn(process.stderr, "write").mockImplementation(() => true);

    const command = testServices.resolve(AppCreateCommand);
    const appName = "test";

    expect(logSpy).not.toHaveBeenCalled();

    await command.execute(appName);

    expect(logSpy).nthCalledWith(
        1,
        expect.stringMatching(/api-cli/),
        expect.stringMatching(new RegExp(`application: '${appName}'`)),
        ""
    );
    expect(logSpy).nthCalledWith(
        2,
        expect.stringMatching(
            new RegExp("^" + msgKeysGenerated([".+?", ".+"]).replace("^", "\\^") + "$")
        )
    );
    expect(logSpy).nthCalledWith(
        3,
        expect.stringMatching(/api-cli/),
        expect.stringMatching(/keys:/),
        "\n"
    );

    await expect(command.execute(appName)).rejects.toThrow(/^process exit 1$/);
    expect(stdErrSpy).nthCalledWith(1, expect.stringMatching(/argument: 'app-name'.*?unique\./));

    let appName2 = "TEST";
    await expect(command.execute(appName2)).rejects.toThrow(/^process exit 1$/);
    expect(stdErrSpy).nthCalledWith(2, expect.stringMatching(/argument: 'app-name'.*?at least 3/));

    appName2 = "t";
    await expect(command.execute(appName2)).rejects.toThrow(/^process exit 1$/);
    expect(stdErrSpy).nthCalledWith(2, expect.stringMatching(/argument: 'app-name'.*?at least 3/));

    appName2 = "t.est";
    await expect(command.execute(appName2)).rejects.toThrow(/^process exit 1$/);
    expect(stdErrSpy).nthCalledWith(2, expect.stringMatching(/argument: 'app-name'.*?at least 3/));

    appName2 = "test-2";
    await command.execute(appName2);

    expect(logSpy).nthCalledWith(
        4,
        expect.stringMatching(/api-cli/),
        expect.stringMatching(new RegExp(`application: '${appName2}'`)),
        ""
    );
    expect(logSpy).nthCalledWith(
        5,
        expect.stringMatching(
            new RegExp("^" + msgKeysGenerated([".+?", ".+"]).replace("^", "\\^") + "$")
        )
    );
    expect(logSpy).nthCalledWith(
        6,
        expect.stringMatching(/api-cli/),
        expect.stringMatching(/keys:/),
        "\n"
    );

    logSpy.mockRestore();
    exitSpy.mockRestore();
    stdErrSpy.mockRestore();
});