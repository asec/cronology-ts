import {testServices} from "../../../../_services";
import {cliContext} from "../../../../_mock/clicontext";

afterEach(() => {
    jest.restoreAllMocks();
});

it("Tests the basic command flow", async () => {
    const logSpy = jest.spyOn(console, "log").mockImplementation();

    const command = testServices.resolve("cli.action.wait");
    await command.execute(...cliContext());

    expect(logSpy).nthCalledWith(
        1,
        expect.stringMatching(/api-cli/),
        expect.stringMatching(/200/),
        ""
    );
    expect(logSpy).nthCalledWith(
        2,
        expect.stringMatching(/api-cli/),
        expect.objectContaining({
            success: true,
            waited: 1000
        }),
        "\n"
    );
});

it("Tests valid parameter configurations", async () => {
    const logSpy = jest.spyOn(console, "log").mockImplementation();
    const waitTime = 10;

    let command = testServices.resolve("cli.action.wait");
    await command.execute(...cliContext([], {
        ms: String(10)
    }));

    expect(logSpy).nthCalledWith(
        1,
        expect.stringMatching(/api-cli/),
        expect.stringMatching(/200/),
        ""
    );
    expect(logSpy).nthCalledWith(
        2,
        expect.stringMatching(/api-cli/),
        expect.objectContaining({
            success: true,
            waited: waitTime
        }),
        "\n"
    );

    command = testServices.resolve("cli.action.wait");
    await command.execute(...cliContext([], {
        ms: waitTime
    }));

    expect(logSpy).nthCalledWith(
        3,
        expect.stringMatching(/api-cli/),
        expect.stringMatching(/200/),
        ""
    );
    expect(logSpy).nthCalledWith(
        4,
        expect.stringMatching(/api-cli/),
        expect.objectContaining({
            success: true,
            waited: waitTime
        }),
        "\n"
    );

    command = testServices.resolve("cli.action.wait");
    await command.execute(...cliContext([], {
        ms: ""
    }));

    expect(logSpy).nthCalledWith(
        5,
        expect.stringMatching(/api-cli/),
        expect.stringMatching(/200/),
        ""
    );
    expect(logSpy).nthCalledWith(
        6,
        expect.stringMatching(/api-cli/),
        expect.objectContaining({
            success: true,
            waited: 1000
        }),
        "\n"
    );

    command = testServices.resolve("cli.action.wait");
    await command.execute(...cliContext([], {
        ms: null
    }));

    expect(logSpy).nthCalledWith(
        5,
        expect.stringMatching(/api-cli/),
        expect.stringMatching(/200/),
        ""
    );
    expect(logSpy).nthCalledWith(
        6,
        expect.stringMatching(/api-cli/),
        expect.objectContaining({
            success: true,
            waited: 1000
        }),
        "\n"
    );
});

it("Tests invalid parameter configurations", async () => {
    const exitSpy = jest.spyOn(process, "exit").mockImplementation((errorCode: unknown) => {
        throw new Error(`process.exit ${errorCode}`);
    });
    const logSpy = jest.spyOn(process.stderr, "write").mockImplementation();

    let command = testServices.resolve("cli.action.wait");
    await expect(command.execute(...cliContext([], {
        ms: -1
    }))).rejects.toThrow(/^process\.exit 1$/);

    expect(exitSpy).nthCalledWith(1, 1);
    expect(logSpy).nthCalledWith(1, expect.stringMatching(/[Ii]nvalid parameter.*?ms.*?greater than/));

    command = testServices.resolve("cli.action.wait");
    await expect(command.execute(...cliContext([], {
        ms: "0"
    }))).rejects.toThrow(/^process\.exit 1$/);

    expect(exitSpy).nthCalledWith(2, 1);
    expect(logSpy).nthCalledWith(2, expect.stringMatching(/[Ii]nvalid parameter.*?ms.*?greater than/));

    command = testServices.resolve("cli.action.wait");
    await expect(command.execute(...cliContext([], {
        ms: "10e10"
    }))).rejects.toThrow(/^process\.exit 1$/);

    expect(exitSpy).nthCalledWith(3, 1);
    expect(logSpy).nthCalledWith(3, expect.stringMatching(/[Ii]nvalid parameter.*?ms.*?less than/));
});