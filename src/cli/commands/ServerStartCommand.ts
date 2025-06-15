import CliCommand, {CliDependencies} from "../../lib/cli/CliCommand.js";
import {HttpMethod} from "../../lib/api/Http.js";
import IServer from "../../lib/server/IServer.js";
import WaitActionParamsParserExpress from "../../api/actions/wait/params/WaitActionParamsParserExpress.js";

class ServerStartOptions
{
    dev: boolean;
}

class ServerStartCommand extends CliCommand
{
    public commandName = "server-start";
    public description = "Starts the API server.";

    public constructor(
        dependencies: CliDependencies,
        protected server: IServer,
    )
    {
        super(dependencies);
    }

    public async do(options: ServerStartOptions)
    {
        this.server.create();

        this.server.defineRoute(HttpMethod.GET, "/", this.services.resolve("api.action.ping"));
        this.server.defineRoute(
            HttpMethod.GET,
            "/wait",
            this.services.resolve("api.action.wait")
                .use(new WaitActionParamsParserExpress())
        );

        if (options.dev)
        {
            this.server.defineRoute(HttpMethod.GET, "/bad-response", this.services.resolve("api.action.badResponse"));
            this.server.defineRoute(HttpMethod.GET, "/test-error", this.services.resolve("api.action.testError"));
        }

        this.server.start(async (error: Error) => await this.error(`${error.name}: ${error.message}`));
    }
}

export default ServerStartCommand;
