import CliCommand from "../../lib/cli/CliCommand";
import ServerStartCommand from "./ServerStartCommand";
import EnvSetCommand from "./EnvSetCommand";
import EnvGetCommand from "./EnvGetCommand";
import PingCommand from "./api/PingCommand";
import WaitCommand from "./api/WaitCommand";
import services from "../../services/default";

const commandList: CliCommand[] = [
    services.resolve(ServerStartCommand),
    services.resolve(EnvSetCommand),
    services.resolve(EnvGetCommand),
    services.resolve(PingCommand),
    services.resolve(WaitCommand)
];

module.exports = commandList;