import {testServices} from "../../../_services";
import {cliContext} from "../../../_mock/clicontext";
import {spyOnCliError, spyOnCliSuccess} from "../../../_mock/clitools";
import {msgKeysGenerated} from "../../../_mock/utils/RsaKeypair";

afterEach(() => {
    jest.restoreAllMocks();
});

it("Tests non-existent apps", async () => {
    const {exitSpy, errorSpy} = spyOnCliError();

    let command = testServices.resolve("cli.command.app-keys");
    await expect(command.execute(...cliContext())).rejects.toThrow(/^process\.exit 1$/);

    expect(exitSpy).nthCalledWith(1, 1);
    expect(errorSpy).nthCalledWith(1, expect.stringMatching(/does not exists/));

    command = testServices.resolve("cli.command.app-keys");
    await expect(command.execute(...cliContext(["test"]))).rejects.toThrow(/^process\.exit 1$/);

    expect(exitSpy).nthCalledWith(3, 1);
    expect(errorSpy).nthCalledWith(3, expect.stringMatching(/does not exists.*?test/));
});

it("Tests the basic command flow", async () => {
    const {logSpy} = spyOnCliSuccess();
    const appName: string = "test";
    const appNameOther: string = "test2";
    const getKeyData = testServices.resolve("rsaKeystore");

    // Create an app without keys
    const factory = testServices.resolve("factory.application");
    let app = factory.create({
        name: appName
    });
    let _id = await factory.repository().store(app);

    // Test for empty keys
    let appKeysCommand = testServices.resolve("cli.command.app-keys");
    await appKeysCommand.execute(...cliContext([appName]));

    expect(logSpy).nthCalledWith(
        1,
        expect.stringMatching(/api-cli/),
        expect.stringMatching(new RegExp(`application.*?'${appName}'`, "i")),
        ""
    );
    expect(logSpy).nthCalledWith(
        2,
        expect.stringMatching(/api-cli/),
        expect.stringMatching(/keys:.*?none/i),
        "\n"
    );

    expect(await factory.repository().delete(_id)).toBe(true);

    // Simulate cli workflow
    let createAppCommand = testServices.resolve("cli.command.app-create");
    await createAppCommand.execute(...cliContext([appName]));

    createAppCommand = testServices.resolve("cli.command.app-create");
    await createAppCommand.execute(...cliContext([appNameOther]));

    [_id, app] = await factory.repository().getOneByKey("name", appNameOther);
    const keyDataOther = getKeyData(await app.keys());

    appKeysCommand = testServices.resolve("cli.command.app-keys");
    await appKeysCommand.execute(...cliContext([appName]));

    [_id, app] = await factory.repository().getOneByKey("name", appName);
    const keyData = getKeyData(await app.keys());

    expect(keyData[0]).not.toBe(keyDataOther[0]);
    expect(keyData[1]).not.toBe(keyDataOther[1]);

    expect(logSpy).nthCalledWith(
        9,
        expect.stringMatching(/api-cli/),
        expect.stringMatching(new RegExp(`application.*?'${appName}'`, "i")),
        ""
    );
    expect(logSpy).nthCalledWith(
        10,
        expect.stringMatching(/api-cli/),
        expect.stringMatching(new RegExp(`keys:.*?${app.data("uuid")}-private.*?${app.data("uuid")}-public`, "is")),
        "\n"
    );

    appKeysCommand = testServices.resolve("cli.command.app-keys");
    await appKeysCommand.execute(...cliContext([appName], {
        recreate: true
    }));
    const newKeyData = getKeyData(await app.keys());

    expect(logSpy).nthCalledWith(11, msgKeysGenerated(await app.keys()));
    expect(logSpy).nthCalledWith(
        12,
        expect.stringMatching(/api-cli/),
        expect.stringMatching(new RegExp(`application.*?'${appName}'`, "i")),
        ""
    );
    expect(logSpy).nthCalledWith(
        13,
        expect.stringMatching(/api-cli/),
        expect.stringMatching(/regenerated/),
        ""
    );
    expect(logSpy).nthCalledWith(
        14,
        expect.stringMatching(/api-cli/),
        expect.stringMatching(new RegExp(`keys:.*?${app.data("uuid")}-private.*?${app.data("uuid")}-public`, "is")),
        "\n"
    );

    expect(newKeyData[0]).not.toBe(keyData[0]);
    expect(newKeyData[1]).not.toBe(keyData[1]);

    appKeysCommand = testServices.resolve("cli.command.app-keys");
    await appKeysCommand.execute(...cliContext([appName], {
        recreate: false
    }));
    const newKeyData2 = getKeyData(await app.keys());

    expect(logSpy).nthCalledWith(
        15,
        expect.stringMatching(/api-cli/),
        expect.stringMatching(new RegExp(`application.*?'${appName}'`, "i")),
        ""
    );
    expect(logSpy).nthCalledWith(
        16,
        expect.stringMatching(/api-cli/),
        expect.stringMatching(new RegExp(`keys:.*?${app.data("uuid")}-private.*?${app.data("uuid")}-public`, "is")),
        "\n"
    );

    expect(newKeyData2[0]).toBe(newKeyData[0]);
    expect(newKeyData2[1]).toBe(newKeyData[1]);

    [_id, app] = await factory.repository().getOneByKey("name", appNameOther);
    const keyDataOther2 = getKeyData(await app.keys());
    expect(keyDataOther[0]).toBe(keyDataOther2[0]);
    expect(keyDataOther[1]).toBe(keyDataOther2[1]);
});