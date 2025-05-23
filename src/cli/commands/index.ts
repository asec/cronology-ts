import CliCommand from "../../lib/cli/CliCommand.js";
import ServerStartCommand from "./ServerStartCommand.js";
import EnvSetCommand from "./EnvSetCommand.js";
import EnvGetCommand from "./EnvGetCommand.js";
import PingCommand from "./api/PingCommand.js";
import services from "../../services/index.js";
import BadResponseCommand from "./api/BadResponseCommand.js";
import TestErrorCommand from "./api/TestErrorCommand.js";
import WaitCommand from "./api/WaitCommand.js";

const commandList: CliCommand[] = [
    services.resolve(ServerStartCommand),
    services.resolve(EnvSetCommand),
    services.resolve(EnvGetCommand),
    services.resolve(PingCommand),
    services.resolve(WaitCommand),
    services.resolve(BadResponseCommand),
    services.resolve(TestErrorCommand)
];

export default commandList;