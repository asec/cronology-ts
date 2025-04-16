import Cli from "./lib/cli/Cli";
import services from "./services/default";

const commands = require("./cli/commands");

const cli = services.resolve(Cli);
cli.init(commands);
cli.start();