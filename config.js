module.exports = {
    BOT_TOKEN: "",
    ADMIN_IDS: [], // Bot owner ID's
    INTERACTIONS: {
        SLASH: true, // Should the interactions be enabled
        CONTEXT: true, // Should contexts be enabled
        GLOBAL: false, // Should the interactions be registered globally
        TEST_GUILD_ID: "", // Guild ID where the interactions should be registered. [** Test you commands here first **]
    },
    /* Bot Embed Colors */
    EMBED_COLORS: {
        DEFAULT: "#FF8C00",
        SUCCESS: "#00FF00",
        ERROR: "#D61A3C",
        WARNING: "#F7E919",
    },
};