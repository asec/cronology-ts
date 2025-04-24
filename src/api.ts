import Cli from "./lib/cli/Cli.js";
import services from "./services/default.js";
import commandList from "./cli/commands/index.js";

const cli = services.resolve(Cli);
await cli.init(commandList);
cli.start();