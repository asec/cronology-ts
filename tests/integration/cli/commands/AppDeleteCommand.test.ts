import {spyOnCliError, spyOnCliSuccess} from "../../../_mock/clitools";
import {testServices} from "../../../_services";
import {cliContext} from "../../../_mock/clicontext";

afterEach(() => {
    jest.restoreAllMocks();
});

it("Tests with non-existent applications", async () => {
    const {exitSpy, errorSpy} = spyOnCliError();

    let command = testServices.resolve("cli.command.app-delete");
    await expect(command.execute(...cliContext())).rejects.toThrow(/^process\.exit 1$/);

    expect(exitSpy).toHaveBeenNthCalledWith(1, 1);
    expect(errorSpy).toHaveBeenNthCalledWith(1, expect.stringMatching(/does not exists/));

    command = testServices.resolve("cli.command.app-delete");
    await expect(command.execute(...cliContext(["test"]))).rejects.toThrow(/^process\.exit 1$/);

    expect(exitSpy).toHaveBeenNthCalledWith(3, 1);
    expect(errorSpy).toHaveBeenNthCalledWith(3, expect.stringMatching(/does not exists.*?'test'/));
});

it("Tests the basic command flow", async () => {
    const {logSpy} = spyOnCliSuccess();
    const factory = testServices.resolve("factory.application");
    const getKeyData = testServices.resolve("rsaKeystore");
    const appName = "test";
    const otherAppName = "test2";

    let appCreateCommand = testServices.resolve("cli.command.app-create");
    await appCreateCommand.execute(...cliContext([appName]));

    appCreateCommand = testServices.resolve("cli.command.app-create");
    await appCreateCommand.execute(...cliContext([otherAppName]));

    let [id, app] = await factory.repository().getOneByKey("name", appName);
    let [id2, app2] = await factory.repository().getOneByKey("name", otherAppName);

    expect(getKeyData(await app.keys())).toHaveLength(2);
    expect(getKeyData(await app2.keys())).toHaveLength(2);

    let appDeleteCommand = testServices.resolve("cli.command.app-delete");
    await appDeleteCommand.execute(...cliContext([appName]));

    expect(logSpy).toHaveBeenNthCalledWith(
        7,
        expect.stringMatching(/api-cli/),
        expect.stringMatching(new RegExp(`deleted.*?${appName}.*?${app.data("uuid")}`, "i")),
        "\n"
    );

    expect(getKeyData(await app.keys())).toHaveLength(0);
    expect(getKeyData(await app2.keys())).toHaveLength(2);

    [id, app] = await factory.repository().getOneByKey("name", appName);
    expect(id).toBeNull();
    expect(app).toBeNull();

    expect(await factory.repository().count()).toBe(1);
});