import CliCommand, {CliDependencies} from "../../lib/cli/CliCommand.js";
import {EnvType} from "../../lib/config/Config.js";
import {HttpMethod} from "../../lib/api/Http.js";
import PingAction from "../../api/actions/ping/PingAction.js";
import IServer from "../../lib/server/IServer.js";
import BadResponseAction from "../../api/actions/bad-response/BadResponseAction.js";
import TestErrorAction from "../../api/actions/test-error/TestErrorAction.js";
import WaitAction from "../../api/actions/wait/WaitAction.js";
import WaitActionParamsParserExpress from "../../api/actions/wait/params/WaitActionParamsParserExpress.js";

class ServerStartOptions
{
    dev: boolean;
}

class ServerStartCommand extends CliCommand
{
    public commandName = "server-start";
    public description = "Starts the API server in production mode.";

    protected registerCliParams()
    {
        this.addOption(
            "-d, --dev",
            "Starts the server in dev mode. This is useful for integration tests (ie. for the PHP app)." +
            " This will use the dev database (configured in .env.dev) and makes the test endpoints available for use.",
            false
        );
    }

    public constructor(
        dependencies: CliDependencies,
        protected server: IServer,
    )
    {
        super(dependencies);
    }

    protected initialise(options: ServerStartOptions)
    {
        this.config.setEnvironment(options.dev ? EnvType.Dev : EnvType.Prod);
    }

    public async do(options: ServerStartOptions)
    {
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

        this.server.start((error: Error) => this.error(`${error.name}: ${error.message}`));
    }
}

export default ServerStartCommand;