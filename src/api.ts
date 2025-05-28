import services from "./services/index.js";
import commandList from "./cli/commands/index.js";

const cli = services.resolve("cli");
await cli.init(commandList);
cli.start();