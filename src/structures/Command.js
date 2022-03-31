const {MessageEmbed} = require("discord.js");
const {permissions, parsePermissions} = require("../utils/botUtils");
const {EMBED_COLORS, ADMIN_IDS} = require("../../config.js");
const CommandCategory = require("./CommandCategory");
const {timeFormat} = require("../utils/miscUtils");

class Command {
    /**
     * @typedef {Object} Validation
     * @property {function} callback - The condition to validate
     * @property {string} message - The message to be displayed if callback condition is not met
     */

    /**
     * @typedef {"UTILITY"} CommandCategory
     */

    /**
     * @typedef {Object} CommandData
     * @property {string} name - The name of the command (must be lowercase)
     * @property {string} description - A short description of the command
     * @property {number} cooldown - The command cooldown in seconds
     * @property {CommandCategory} category - The category this command belongs to
     * @property {import('discord.js').PermissionResolvable[]} [botPermissions] - Permissions required by the client to use the command.
     * @property {import('discord.js').PermissionResolvable[]} [userPermissions] - Permissions required by the user to use the command
     * @property {Validation[]} [validations] - List of validations to be run before the command is executed
     * @property {boolean} enabled - Whether the command is enabled or not
     * @property {boolean} ephemeral - Whether the reply should be ephemeral
     * @property {import('discord.js').ApplicationCommandOptionData[]} options - command options
     */

    /**
     * @param {import('@src/structures').BotClient} client - The discord client
     * @param {{name: string, options: [{name: string, description: string, type: string, required: boolean}], description: string, category: string, enabled: boolean, botPermissions: string[]}} data - The command information
     */
    constructor(client, data) {
        this.constructor.validateInfo(client, data);
        this.client = client;
        this.name = data.name;
        this.description = data.description;
        this.cooldown = data.cooldown || 0;
        this.category = data.category || "NONE";
        this.botPermissions = data.botPermissions || [];
        this.userPermissions = data.userPermissions || [];
        this.validations = data.validations || [];

        /**
         * @type {InteractionInfo}
         */
        if (data.enabled && typeof this.interactionRun !== "function") {
            throw new Error(`Command ${this.name} doesn't has a interactionRun function`);
        }

        this.enabled = Object.prototype.hasOwnProperty.call(data, "enabled")
            ? data.enabled
            : false;

        this.ephemeral = Object.prototype.hasOwnProperty.call(data, "ephemeral")
            ? data.ephemeral
            : false;

        this.options = data.options || [];
    }

    /**
     * Validates the constructor parameters
     * @param {import('@src/structures').BotClient} client - Client to validate
     * @param {{name: string, options: {name: string, description: string, type: string, required: boolean}[], description: string, category: string, enabled: boolean, botPermissions: string[]}} data - Info to validate
     * @private
     */
    static validateInfo(client, data) {
        if (!client) throw new Error("A client must be specified.");
        if (typeof data !== "object") {
            throw new TypeError("Command data must be an Object.");
        }
        if (typeof data.name !== "string" || data.name !== data.name.toLowerCase()) {
            throw new Error("Command name must be a lowercase string.");
        }
        if (typeof data.description !== "string") {
            throw new TypeError("Command description must be a string.");
        }
        if (data.cooldown && typeof data.cooldown !== "number") {
            throw new TypeError("Command cooldown must be a number");
        }
        if (data.category) {
            if (!Object.prototype.hasOwnProperty.call(CommandCategory, data.category)) {
                throw new Error(`Not a valid category ${data.category}`);
            }
        }
        if (data.userPermissions) {
            if (!Array.isArray(data.userPermissions)) {
                throw new TypeError("Command userPermissions must be an Array of permission key strings.");
            }
            for (const perm of data.userPermissions) {
                if (!permissions[perm]) throw new RangeError(`Invalid command userPermission: ${perm}`);
            }
        }
        if (data.botPermissions) {
            if (!Array.isArray(data.botPermissions)) {
                throw new TypeError("Command botPermissions must be an Array of permission key strings.");
            }
            for (const perm of data.botPermissions) {
                if (!permissions[perm]) throw new RangeError(`Invalid command botPermission: ${perm}`);
            }
        }
        if (data.validations) {
            if (!Array.isArray(data.validations)) {
                throw new TypeError("Command validations must be an Array of validation Objects.");
            }
            for (const validation of data.validations) {
                if (typeof validation !== "object") {
                    throw new TypeError("Command validations must be an object.");
                }
                if (typeof validation.callback !== "function") {
                    throw new TypeError("Command validation callback must be a function.");
                }
                if (typeof validation.message !== "string") {
                    throw new TypeError("Command validation message must be a string.");
                }
            }
        }

        // Validate Slash Command Details
        if (
            Object.prototype.hasOwnProperty.call(data, "enabled") &&
            typeof data.enabled !== "boolean"
        ) {
            throw new TypeError("Command enabled must be a boolean value");
        }
        if (
            Object.prototype.hasOwnProperty.call(data, "ephemeral") &&
            typeof data.ephemeral !== "boolean"
        ) {
            throw new TypeError("Command ephemeral must be a boolean value");
        }
        if (data.options && !Array.isArray(data.options)) {
            throw new TypeError("Command options must be a array");
        }
    }

    /**
     *
     * @param {import('discord.js').CommandInteraction} interaction
     */
    async executeInteraction(interaction) {
        // callback validations
        for (const validation of this.validations) {
            if (!validation.callback(interaction)) {
                return interaction.reply({
                    content: validation.message,
                    ephemeral: true,
                });
            }
        }

        // Admin commands
        if (this.category === "ADMIN" && !ADMIN_IDS.includes(interaction.user.id)) {
            return interaction.reply({
                content: `This command is only accessible to bot admins`,
                ephemeral: true,
            });
        }

        // user permissions
        if (interaction.member && this.userPermissions.length > 0) {
            if (!interaction.member.permissions.has(this.userPermissions)) {
                return interaction.reply({
                    content: `You need ${parsePermissions(this.userPermissions)} for this command`,
                    ephemeral: true,
                });
            }
        }

        // bot permissions
        if (this.botPermissions.length > 0) {
            if (!interaction.guild.me.permissions.has(this.botPermissions)) {
                return interaction.reply({
                    content: `I need ${parsePermissions(this.botPermissions)} for this command`,
                    ephemeral: true,
                });
            }
        }

        // cooldown check
        if (this.cooldown > 0) {
            const remaining = this.getRemainingCooldown(interaction.user.id);
            if (remaining > 0) {
                return interaction.reply({
                    content: `You are on cooldown. You can again use the command in \`${timeFormat(remaining)}\``,
                    ephemeral: true,
                });
            }
        }

        try {
            await interaction.deferReply({ephemeral: this.ephemeral});
            await this.interactionRun(interaction);
        } catch (ex) {
            await interaction.followUp("Oops! An error occurred while running the command");
            this.client.logger.error("interactionRun", ex);
        } finally {
            this.applyCooldown(interaction.user.id);
        }
    }

    getSlashUsage() {
        let desc = "";
        if (this.options.find((o) => o.type === "SUB_COMMAND")) {
            const subCmds = this.options.filter((opt) => opt.type === "SUB_COMMAND");
            subCmds.forEach((sub) => {
                desc += `\`/${this.name} ${sub.name}\`\n❯ ${sub.description}\n\n`;
            });
        } else {
            desc += `\`/${this.name}\`\n\n**Help:** ${this.description}`;
        }

        if (this.cooldown) {
            desc += `\n**Cooldown:** ${timeFormat(this.cooldown)}`;
        }

        return new MessageEmbed().setColor(EMBED_COLORS.DEFAULT).setDescription(desc);
    }

    getRemainingCooldown(memberId) {
        const key = this.name + "|" + memberId;
        if (this.client.cmdCooldownCache.has(key)) {
            const remaining = (Date.now() - this.client.cmdCooldownCache.get(key)) * 0.001;
            if (remaining > this.cooldown) {
                this.client.cmdCooldownCache.delete(key);
                return 0;
            }
            return this.cooldown - remaining;
        }
        return 0;
    }

    applyCooldown(memberId) {
        const key = this.name + "|" + memberId;
        this.client.cmdCooldownCache.set(key, Date.now());
    }

    interactionRun(_interaction) {
        throw new Error("This method must be implemented!")
    }
}

module.exports = Command;
