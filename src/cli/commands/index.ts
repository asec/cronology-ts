import CliCommand from "../../lib/cli/CliCommand";
import ServerStartCommand from "./ServerStartCommand";
import EnvSetCommand from "./EnvSetCommand";
import EnvGetCommand from "./EnvGetCommand";
import PingCommand from "./api/PingCommand";
import WaitCommand from "./api/WaitCommand";

const commandList: typeof CliCommand[] = [
    ServerStartCommand,
    EnvSetCommand,
    EnvGetCommand,
    PingCommand,
    WaitCommand
];

module.exports = commandList;