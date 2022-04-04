// noinspection JSCheckFunctionSignatures

const {Command, CommandCategory, BotClient} = require("../../structures");
const {EMBED_COLORS} = require("../../../config.js");
const {
    MessageEmbed,
    MessageActionRow,
    MessageSelectMenu,
    Message,
    MessageButton,
    CommandInteraction,
} = require("discord.js");

const CMDS_PER_PAGE = 5;
const IDLE_TIMEOUT = 30;
const cache = {};

module.exports = class HelpCommand extends Command {
    constructor(client) {
        super(client, {
            name: "help",
            description: "Command help menu",
            category: "UTILITY",
            botPermissions: ["EMBED_LINKS"],
            enabled: true,
            options: [
                {
                    name: "command",
                    description: "Command name",
                    required: false,
                    type: "STRING",
                },
            ],
        });
    }

    /**
     * @param {CommandInteraction} interaction
     */
    async interactionRun(interaction) {
        let cmdName = interaction.options.getString("command");

        // !help
        if (!cmdName) {
            if (cache[`${interaction.guildId}|${interaction.user.id}`]) {
                return interaction.followUp("You are already viewing the help menu.");
            }
            const response = await getHelpMenu(interaction);
            const sentMsg = await interaction.followUp(response);
            return waiter(sentMsg, interaction.user.id);
        }

        // check if command help (!help cat)
        const cmd = this.client.slashCommands.get(cmdName);
        if (cmd) {
            const embed = cmd.getSlashUsage();
            return interaction.followUp({embeds: [embed]});
        }

        // No matching command/category found
        await interaction.followUp("No matching command found");
    }
};

/**
 * @param {CommandInteraction} interaction
 */
async function getHelpMenu({client}) {
    // Menu Row
    const options = [];
    const keys = Object.keys(CommandCategory);
    keys.forEach((key) => {
        const value = CommandCategory[key];
        const data = {
            label: value.name,
            value: key,
            description: `View commands in ${value.name} category`,
            emoji: value.emoji,
        };
        options.push(data);
    });

    const menuRow = new MessageActionRow().addComponents(
        new MessageSelectMenu().setCustomId("help-menu").setPlaceholder("Choose the command category").addOptions(options)
    );

    // Buttons Row
    let components = [];
    components.push(
        new MessageButton().setCustomId("previousBtn").setEmoji("⬅️").setStyle("SECONDARY").setDisabled(true),
        new MessageButton().setCustomId("nextBtn").setEmoji("➡️").setStyle("SECONDARY").setDisabled(true)
    );

    let buttonsRow = new MessageActionRow().addComponents(components);

    const embed = new MessageEmbed()
        .setColor(EMBED_COLORS.DEFAULT)
        .setThumbnail(client.user.displayAvatarURL())
        .setDescription(
            "**About Me:**\n"
        );

    return {
        embeds: [embed],
        components: [menuRow, buttonsRow],
    };
}

/**
 * @param {Message} msg
 * @param {string} userId
 */
const waiter = (msg, userId) => {
    // Add to cache
    cache[`${msg.guildId}|${userId}`] = Date.now();

    const collector = msg.channel.createMessageComponentCollector({
        filter: (reactor) => reactor.user.id === userId,
        idle: IDLE_TIMEOUT * 1000,
        dispose: true,
        time: 5 * 60 * 1000,
    });

    let arrEmbeds = [];
    let currentPage = 0;
    let menuRow = msg.components[0];
    let buttonsRow = msg.components[1];

    collector.on("collect", async (response) => {
        await response.deferUpdate();

        switch (response.customId) {
            case "help-menu": {
                const cat = response.values[0].toUpperCase();
                arrEmbeds = getSlashCategoryEmbeds(msg.client, cat);
                currentPage = 0;
                buttonsRow.components.forEach((button) => button.setDisabled(arrEmbeds.length <= 1));
                msg.editable && (await msg.edit({embeds: [arrEmbeds[currentPage]], components: [menuRow, buttonsRow]}));
                break;
            }

            case "previousBtn":
                if (currentPage !== 0) {
                    --currentPage;
                    msg.editable && (await msg.edit({
                        embeds: [arrEmbeds[currentPage]],
                        components: [menuRow, buttonsRow]
                    }));
                }
                break;

            case "nextBtn":
                if (currentPage < arrEmbeds.length - 1) {
                    currentPage++;
                    msg.editable && (await msg.edit({
                        embeds: [arrEmbeds[currentPage]],
                        components: [menuRow, buttonsRow]
                    }));
                }
                break;
        }
    });

    collector.on("end", () => {
        if (cache[`${msg.guildId}|${userId}`]) delete cache[`${msg.guildId}|${userId}`];
        if (!msg.guild || !msg.channel) return;
        return msg.editable && msg.edit({components: []});
    });
};

/**
 * Returns an array of message embeds for a particular command category [SLASH COMMANDS]
 * @param {BotClient} client
 * @param {string} category
 */
function getSlashCategoryEmbeds(client, category) {
    // For Each Category
    const commands = Array.from(client.slashCommands.filter((cmd) => cmd.category === category).values());

    if (commands.length === 0) {
        const embed = new MessageEmbed()
            .setColor(EMBED_COLORS.DEFAULT)
            .setThumbnail(CommandCategory[category]?.image)
            .setAuthor({name: `${category} Commands`})
            .setDescription("No commands in this category");

        return [embed];
    }

    const arrSplitted = [];
    const arrEmbeds = [];

    while (commands.length) {
        let toAdd = commands.splice(0, commands.length > CMDS_PER_PAGE ? CMDS_PER_PAGE : commands.length);

        toAdd = toAdd.map((cmd) => {
            const subCmds = cmd.options.filter((opt) => opt.type === "SUB_COMMAND");
            const subCmdsString = subCmds.map((s) => s.name).join(", ");

            return `\`/${cmd.name}\`\n ❯ **Description**: ${cmd.description}\n ${
                subCmds === 0 ? "" : `❯ **SubCommands [${subCmds.length}]**: ${subCmdsString}\n`
            } `;
        });

        arrSplitted.push(toAdd);
    }

    arrSplitted.forEach((item, index) => {
        const embed = new MessageEmbed()
            .setColor(EMBED_COLORS.DEFAULT)
            .setThumbnail(CommandCategory[category]?.image)
            .setAuthor({name: `${category} Commands`})
            .setDescription(item.join("\n"))
            .setFooter({text: `page ${index + 1} of ${arrSplitted.length}`});
        arrEmbeds.push(embed);
    });

    return arrEmbeds;
}
