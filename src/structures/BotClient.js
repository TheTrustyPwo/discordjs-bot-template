const {Client, Collection, Intents} = require("discord.js");
const path = require("path");
const fs = require("fs");
const {table} = require("table");
const logger = require("../helpers/logger");
const Command = require("./Command");

module.exports = class BotClient extends Client {
    constructor() {
        super({
            intents: [
                Intents.FLAGS.GUILDS,
                Intents.FLAGS.GUILD_MESSAGES,
                Intents.FLAGS.GUILD_INVITES,
                Intents.FLAGS.GUILD_MEMBERS,
                Intents.FLAGS.GUILD_PRESENCES,
                Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
                Intents.FLAGS.GUILD_VOICE_STATES,
            ],
            restRequestTimeout: 2000,
            partials: ["USER", "MESSAGE", "REACTION"],
            allowedMentions: {
                repliedUser: false,
            },
        });

        this.config = require("../../config"); // load the config file

        /**
         * @type {Collection<string, Command>}
         */
        this.slashCommands = new Collection(); // store slash commands

        // initialize cache
        this.cmdCooldownCache = new Collection(); // store message cooldowns for commands

        // Logger
        this.logger = logger;
    }

    /**
     * @param {string} directory
     * @private
     */
    getAbsoluteFilePaths(directory) {
        const filePaths = [];
        const readCommands = (dir) => {
            const files = fs.readdirSync(path.join(__appRoot, dir));
            files.forEach((file) => {
                const stat = fs.lstatSync(path.join(__appRoot, dir, file));
                if (stat.isDirectory()) {
                    readCommands(path.join(dir, file));
                } else {
                    const extension = path.extname(file);
                    if (extension !== ".js") {
                        this.logger.debug(`getAbsoluteFilePaths - Skipping ${file}: not a js file`);
                        return;
                    }
                    const filePath = path.join(__appRoot, dir, file);
                    filePaths.push(filePath);
                }
            });
        };
        readCommands(directory);
        return filePaths;
    }

    /**
     * Load all events from the specified directory
     * @param {string} directory directory containing the event files
     */
    loadEvents(directory) {
        this.logger.log(`Loading events...`);
        let success = 0;
        let failed = 0;
        const clientEvents = [];

        this.getAbsoluteFilePaths(directory).forEach((filePath) => {
            const file = path.basename(filePath);
            try {
                const eventName = path.basename(file, ".js");
                const event = require(filePath);

                // bot events
                this.on(eventName, event.bind(null, this));
                clientEvents.push([file, "✓"]);

                delete require.cache[require.resolve(filePath)];
                success += 1;
            } catch (ex) {
                failed += 1;
                this.logger.error(`loadEvent - ${file}`, ex);
            }
        });

        console.log(
            table(clientEvents, {
                header: {
                    alignment: "center",
                    content: "Client Events",
                },
                singleLine: true,
                columns: [{width: 25}, {width: 5, alignment: "center"}],
            })
        );

        this.logger.log(`Loaded ${success + failed} events. Success (${success}) Failed (${failed})`);
    }

    /**
     * Register command file in the client
     * @param {Command} cmd
     */
    loadCommand(cmd) {
        if (this.slashCommands.has(cmd.name)) throw new Error(`Slash Command ${cmd.name} already registered`)
        if (cmd.enabled) {
            this.slashCommands.set(cmd.name, cmd);
        }
    }

    /**
     * Load all commands from the specified directory
     * @param {string} directory
     */
    loadCommands(directory) {
        this.logger.log(`Loading commands...`);
        this.getAbsoluteFilePaths(directory).forEach((filePath) => {
            const file = path.basename(filePath);
            try {
                const cmdClass = require(filePath);
                if (!(cmdClass.prototype instanceof Command)) return;
                const cmd = new cmdClass(this);
                this.loadCommand(cmd);
            } catch (ex) {
                this.logger.error(`Failed to load ${file} Reason: ${ex.message}`);
            }
        });
        this.logger.success(`Loaded ${this.slashCommands.size} slash commands`);
        if (this.slashCommands.size > 100) throw new Error("A maximum of 100 slash commands can be enabled");
    }

    /**
     * Register slash command on startup
     * @param {string} [guildId]
     */
    async registerInteractions(guildId) {
        const toRegister = [];

        // filter slash commands
        if (this.config.INTERACTIONS.SLASH) {
            this.slashCommands
                .map((cmd) => ({
                    name: cmd.name,
                    description: cmd.description,
                    type: "CHAT_INPUT",
                    options: cmd.options,
                }))
                .forEach((s) => toRegister.push(s));
        }
        // Register Globally
        if (!guildId) {
            await this.application.commands.set(toRegister);
        }

        // Register for a specific guild
        else if (guildId && typeof guildId === "string") {
            const guild = this.guilds.cache.get(guildId);
            if (!guild) throw new Error(`No guilds found matching ${guildId}`);
            await guild.commands.set(toRegister);
        }

        // Throw an error
        else {
            throw new Error(`Did you provide a valid guildId to register slash commands`);
        }

        this.logger.success("Successfully registered slash commands");
    }
};
