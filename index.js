const path = require("path");
const {startupCheck} = require("./src/utils/botUtils");
const BotClient = require("./src/structures/BotClient");
const config = require("./config");

global.__appRoot = path.resolve(__dirname);

// initialize client
const client = new BotClient();
client.loadCommands("src/commands");
client.loadEvents("src/events");

// find unhandled promise rejections
process.on("unhandledRejection", (err) => client.logger.error(`Unhandled exception`, err));

(async () => {
    await startupCheck();
    await client.login(config.BOT_TOKEN);
})();
