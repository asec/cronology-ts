import {testServices} from "../../../_services";
import {msgKeysGenerated} from "../../../_mock/utils/RsaKeypair";
import {cliContext} from "../../../_mock/clicontext";

it("Instantiates and runs the command", async () => {
    const logSpy = jest.spyOn(console, "log").mockImplementation();
    const exitSpy = jest.spyOn(process, "exit").mockImplementation((code?: number): never => {
        throw new Error(`process exit ${code}`);
    });
    const stdErrSpy = jest.spyOn(process.stderr, "write").mockImplementation(() => true);

    const command = testServices.resolve("cli.command.app-create");
    const appName = "test";

    expect(logSpy).not.toHaveBeenCalled();

    await command.execute(...cliContext([appName]));

    expect(logSpy).toHaveBeenNthCalledWith(
        1,
        expect.stringMatching(/api-cli/),
        expect.stringMatching(new RegExp(`application: '${appName}'`)),
        ""
    );
    expect(logSpy).toHaveBeenNthCalledWith(
        2,
        expect.stringMatching(
            new RegExp("^" + msgKeysGenerated([".+?", ".+"]).replace("^", "\\^") + "$")
        )
    );
    expect(logSpy).toHaveBeenNthCalledWith(
        3,
        expect.stringMatching(/api-cli/),
        expect.stringMatching(/keys:/),
        "\n"
    );

    await expect(command.execute(...cliContext([appName]))).rejects.toThrow(/^process exit 1$/);
    expect(stdErrSpy).toHaveBeenNthCalledWith(1, expect.stringMatching(/argument: 'app-name'.*?unique\./));

    let appName2 = "TEST";
    await expect(command.execute(...cliContext([appName2]))).rejects.toThrow(/^process exit 1$/);
    expect(stdErrSpy).toHaveBeenNthCalledWith(2, expect.stringMatching(/argument: 'app-name'.*?at least 3/));

    appName2 = "t";
    await expect(command.execute(...cliContext([appName2]))).rejects.toThrow(/^process exit 1$/);
    expect(stdErrSpy).toHaveBeenNthCalledWith(3, expect.stringMatching(/argument: 'app-name'.*?at least 3/));

    appName2 = "t.est";
    await expect(command.execute(...cliContext([appName2]))).rejects.toThrow(/^process exit 1$/);
    expect(stdErrSpy).toHaveBeenNthCalledWith(4, expect.stringMatching(/argument: 'app-name'.*?at least 3/));

    appName2 = "test-2";
    await command.execute(...cliContext([appName2]));

    expect(logSpy).toHaveBeenNthCalledWith(
        4,
        expect.stringMatching(/api-cli/),
        expect.stringMatching(new RegExp(`application: '${appName2}'`)),
        ""
    );
    expect(logSpy).toHaveBeenNthCalledWith(
        5,
        expect.stringMatching(
            new RegExp("^" + msgKeysGenerated([".+?", ".+"]).replace("^", "\\^") + "$")
        )
    );
    expect(logSpy).toHaveBeenNthCalledWith(
        6,
        expect.stringMatching(/api-cli/),
        expect.stringMatching(/keys:/),
        "\n"
    );

    logSpy.mockRestore();
    exitSpy.mockRestore();
    stdErrSpy.mockRestore();
});
