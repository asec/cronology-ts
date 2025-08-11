import services from "./services/index.js";
import commandList from "./cli/commands/index.js";

// TEST 2
const cli = services.resolve("cli");
await cli.init(commandList);
await cli.start();