import CliCommand from "../../lib/cli/CliCommand.js";
import {EnvType} from "../../lib/config/Config.js";
import {Command} from "commander";
import {HttpMethod} from "../../lib/api/Http.js";
import PingAction from "../../api/actions/ping/PingAction.js";
import ServiceContainer from "../../lib/service/ServiceContainer.js";
import IServer from "../../lib/server/IServer.js";
import AppConfig from "../../config/AppConfig.js";
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
        protected config: AppConfig,
        protected program: Command,
        protected process: NodeJS.Process,
        protected server: IServer,
        protected services: ServiceContainer
    )
    {
        super(config, program, process, services);
    }

    protected initialise(options: ServerStartOptions)
    {
        this.config.setEnvironment(options.dev ? EnvType.Dev : EnvType.Prod);
    }

    public async do(options: ServerStartOptions)
    {
        this.server.defineRoute(HttpMethod.GET, "/", this.services.resolve(PingAction));
        this.server.defineRoute(
            HttpMethod.GET,
            "/wait",
            this.services.resolve(WaitAction)
                .use(new WaitActionParamsParserExpress())
        );

        if (options.dev)
        {
            this.server.defineRoute(HttpMethod.GET, "/bad-response", this.services.resolve(BadResponseAction));
            this.server.defineRoute(HttpMethod.GET, "/test-error", this.services.resolve(TestErrorAction));
        }

        this.server.start((error: Error) => this.error(`${error.name}: ${error.message}`));
    }
}

export default ServerStartCommand;