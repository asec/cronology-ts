import CliCommand from "../../lib/cli/CliCommand.js";
import services from "../../services/index.js";

const commandList: CliCommand[] = [
    services.resolve("cli.command.server-start"),
    services.resolve("cli.command.env-get"),
    services.resolve("cli.command.env-set"),
    services.resolve("cli.command.app-list"),
    services.resolve("cli.command.app-create"),
    services.resolve("cli.command.app-keys"),
    services.resolve("cli.command.app-ip"),
    services.resolve("cli.command.app-delete"),
    services.resolve("cli.action.ping"),
    services.resolve("cli.action.wait"),
    services.resolve("cli.action.badResponse"),
    services.resolve("cli.action.testError"),
];

export default commandList;