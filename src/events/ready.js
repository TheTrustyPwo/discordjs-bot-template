module.exports = async (client) => {
    client.logger.success(`Logged in as ${client.user.tag}! (${client.user.id})`);

    // Register Interactions
    if (client.config.INTERACTIONS.SLASH || client.config.INTERACTIONS.CONTEXT) {
        if (client.config.INTERACTIONS.GLOBAL) await client.registerInteractions();
        else await client.registerInteractions(client.config.INTERACTIONS.TEST_GUILD_ID);
    }
};
