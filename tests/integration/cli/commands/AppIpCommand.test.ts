import {spyOnCliError, spyOnCliSuccess} from "../../../_mock/clitools";
import {testServices} from "../../../_services";
import {cliContext} from "../../../_mock/clicontext";

afterEach(() => {
    jest.restoreAllMocks();
});

it("Tests non-existent apps", async () => {
    const {exitSpy, errorSpy} = spyOnCliError();

    let command = testServices.resolve("cli.command.app-ip");
    await expect(command.execute(...cliContext())).rejects.toThrow(/^process\.exit 1$/);

    expect(exitSpy).nthCalledWith(1, 1);
    expect(errorSpy).nthCalledWith(1, expect.stringMatching(/does not exists/));

    command = testServices.resolve("cli.command.app-ip");
    await expect(command.execute(...cliContext(["test"]))).rejects.toThrow(/^process\.exit 1$/);

    expect(exitSpy).nthCalledWith(3, 1);
    expect(errorSpy).nthCalledWith(3, expect.stringMatching(/does not exists.*?test/));
});

it("Tests the basic command flow", async () => {
    const {logSpy} = spyOnCliSuccess();
    const factory = testServices.resolve("factory.application");
    const appName = "test";
    const otherAppName = "test2";

    let appCreateCommand = testServices.resolve("cli.command.app-create");
    await appCreateCommand.execute(...cliContext([appName]));

    appCreateCommand = testServices.resolve("cli.command.app-create");
    await appCreateCommand.execute(...cliContext([otherAppName]));

    let appIpCommand = testServices.resolve("cli.command.app-ip");
    await appIpCommand.execute(...cliContext([appName]));

    let expectIps = (() => {
        let lineCounter = 7;
        return async (ips: string[]) => {
            expect(logSpy).nthCalledWith(
                lineCounter++,
                expect.stringMatching(/api-cli/),
                expect.stringMatching(/application.*?test/i),
                ""
            );
            expect(logSpy).nthCalledWith(
                lineCounter++,
                expect.stringMatching(/api-cli/),
                expect.stringMatching(new RegExp(`whitelisted.*?${
                    ips.map(ip => ip.replace(".", "\\.")).join(".*?,.*?") || "none"
                }`)),
                "\n"
            );

            const [id, app] = await factory.repository().getOneByKey("name", appName);
            expect(app.data("ip")).toStrictEqual(ips);
            const [id2, app2] = await factory.repository().getOneByKey("name", otherAppName);
            expect(app2.data("ip")).toStrictEqual([]);
        };
    })();

    await expectIps([]);

    appIpCommand = testServices.resolve("cli.command.app-ip");
    await appIpCommand.execute(...cliContext([appName], {
        add: ["::1"]
    }));

    await expectIps(["::1"]);

    appIpCommand = testServices.resolve("cli.command.app-ip");
    await appIpCommand.execute(...cliContext([appName], {
        add: ["127.0.0.1", "0.0.0.0", "1.1.1.1"]
    }));

    await expectIps(["::1", "127.0.0.1", "0.0.0.0", "1.1.1.1"]);

    appIpCommand = testServices.resolve("cli.command.app-ip");
    await appIpCommand.execute(...cliContext([appName], {
        remove: ["0"]
    }));

    await expectIps(["::1", "127.0.0.1", "0.0.0.0", "1.1.1.1"]);

    appIpCommand = testServices.resolve("cli.command.app-ip");
    await appIpCommand.execute(...cliContext([appName], {
        remove: ["0.0.0.0"]
    }));

    await expectIps(["::1", "127.0.0.1", "1.1.1.1"]);

    appIpCommand = testServices.resolve("cli.command.app-ip");
    await appIpCommand.execute(...cliContext([appName], {
        remove: ["::1", "1.1.1.1"]
    }));

    await expectIps(["127.0.0.1"]);

    appIpCommand = testServices.resolve("cli.command.app-ip");
    await appIpCommand.execute(...cliContext([appName], {
        remove: ["127.0.0.1", "::2"],
        add: ["::1", "::2"]
    }));

    await expectIps(["::1"]);

    appIpCommand = testServices.resolve("cli.command.app-ip");
    await appIpCommand.execute(...cliContext([appName], {
        add: ["2.2.2.2"],
        remove: ["::1"]
    }));

    await expectIps(["2.2.2.2"]);

    appIpCommand = testServices.resolve("cli.command.app-ip");
    await appIpCommand.execute(...cliContext([appName], {
        add: ["0.0.0.0", "::5", "1.2.3.4"],
        remove: ["::5", "0.0.0.0", "test", "2.2.2.2", "1.2.3.4"]
    }));

    await expectIps([]);
});

it("Tests for invalid ips", async () => {
    const {exitSpy, errorSpy} = spyOnCliError();
    const factory = testServices.resolve("factory.application");
    const appName = "test";

    const app = factory.create({
        name: appName
    });
    await factory.repository().store(app);

    const expectError = (() => {
        let lineCounter = 1;

        return async (failFor: string, addIps: string[], removeIps?: string[]) => {
            let options: {add: string[], remove?: string[]} = {
                add: addIps
            };
            if (removeIps)
            {
                options.remove = removeIps;
            }

            const command = testServices.resolve("cli.command.app-ip");
            await expect(command.execute(...cliContext([appName], options))).rejects.toThrow(/^process\.exit 1$/);

            expect(exitSpy).nthCalledWith(lineCounter, 1);
            expect(errorSpy).nthCalledWith(
                lineCounter,
                expect.stringMatching(new RegExp(`invalid ip.*?'${failFor}'`, "i"))
            );

            lineCounter++;

            const [_, app] = await factory.repository().getOneByKey("name", appName);
            expect(app.data("ip")).toStrictEqual([]);
        };
    })();


    await expectError("0", ["0"]);
    await expectError("aaa", ["::1", "127.0.0.1", "aaa", "2.2.2.2"]);
    await expectError("10", ["10", "::1", "127.0.0.1"]);
    await expectError("1.1.1", ["1.1.1"], ["1.1.1", "::1"]);
    await expectError("a", ["1.2.3.4", "a"], ["1.2.3.4", "b"]);
});