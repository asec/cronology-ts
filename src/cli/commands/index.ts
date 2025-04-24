import CliCommand from "../../lib/cli/CliCommand.js";
import ServerStartCommand from "./ServerStartCommand.js";
import EnvSetCommand from "./EnvSetCommand.js";
import EnvGetCommand from "./EnvGetCommand.js";
import PingCommand from "./api/PingCommand.js";
import WaitCommand from "./api/WaitCommand.js";
import services from "../../services/default.js";
import AppCreateCommand from "./AppCreateCommand.js";
import AppIpCommand from "./AppIpCommand.js";
import AppKeysCommand from "./AppKeysCommand.js";
import BadResponseCommand from "./api/BadResponseCommand.js";
import TestErrorCommand from "./api/TestErrorCommand.js";
import AppDataCommand from "./api/AppDataCommand.js";

const commandList: CliCommand[] = [
    services.resolve(ServerStartCommand),
    services.resolve(EnvSetCommand),
    services.resolve(EnvGetCommand),
    services.resolve(AppCreateCommand),
    services.resolve(AppIpCommand),
    services.resolve(AppKeysCommand),
    services.resolve(PingCommand),
    services.resolve(WaitCommand),
    services.resolve(AppDataCommand),
    services.resolve(BadResponseCommand),
    services.resolve(TestErrorCommand)
];

export default commandList;