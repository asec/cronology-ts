import CliCommand from "../../lib/cli/CliCommand";
import ServerStartCommand from "./ServerStartCommand";
import EnvSetCommand from "./EnvSetCommand";
import EnvGetCommand from "./EnvGetCommand";
import PingCommand from "./api/PingCommand";
import WaitCommand from "./api/WaitCommand";
import services from "../../services/default";
import AppCreateCommand from "./AppCreateCommand";
import AppIpCommand from "./AppIpCommand";
import AppKeysCommand from "./AppKeysCommand";

const commandList: CliCommand[] = [
    services.resolve(ServerStartCommand),
    services.resolve(EnvSetCommand),
    services.resolve(EnvGetCommand),
    services.resolve(PingCommand),
    services.resolve(WaitCommand),
    services.resolve(AppCreateCommand),
    services.resolve(AppIpCommand),
    services.resolve(AppKeysCommand)
];

module.exports = commandList;