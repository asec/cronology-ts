import CliCommand from "../../lib/cli/CliCommand";
import Config, {EnvType} from "../../lib/config/Config";
import WebServer from "../../api/WebServer";

class ServerStartOptions
{
    dev: boolean;
}

class ServerStartCommand extends CliCommand
{
    static
    {
        this.commandName = "server-start";
        this.description = "Starts the API server in production mode.";

        this.addOption(
            "-d, --dev",
            "Starts the server in dev mode. This is useful for integration tests (ie. for the PHP app)." +
            " This will use the dev database (configured in .env.dev) and makes the test endpoints available for use.",
            false
        );
    }

    public static doWithInitialization(options: ServerStartOptions)
    {
        Config.setEnvironment(options.dev ? EnvType.Dev : EnvType.Prod);
        WebServer.start();
    }
}

export default ServerStartCommand;