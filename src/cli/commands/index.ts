import CliCommand from "../../lib/cli/CliCommand.js";
import ServerStartCommand from "./ServerStartCommand.js";
import EnvSetCommand from "./EnvSetCommand.js";
import EnvGetCommand from "./EnvGetCommand.js";
import PingCommand from "./api/PingCommand.js";
import services from "../../services/default.js";
import BadResponseCommand from "./api/BadResponseCommand.js";
import TestErrorCommand from "./api/TestErrorCommand.js";

const commandList: CliCommand[] = [
    services.resolve(ServerStartCommand),
    services.resolve(EnvSetCommand),
    services.resolve(EnvGetCommand),
    services.resolve(PingCommand),
    services.resolve(BadResponseCommand),
    services.resolve(TestErrorCommand)
];

export default commandList;