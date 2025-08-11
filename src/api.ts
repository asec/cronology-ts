import services from "./services/index.js";
import commandList from "./cli/commands/index.js";

// TEST
const cli = services.resolve("cli");
await cli.init(commandList);
await cli.start();