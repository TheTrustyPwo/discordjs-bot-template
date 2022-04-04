[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]



<!-- PROJECT LOGO -->
<!--suppress HtmlDeprecatedAttribute, HtmlUnknownAnchorTarget -->
<br />
<div align="center">

<h3 align="center">Discord.js Bot Template</h3>

  <p align="center">
    An awesome Discord.js Bot Template to jumpstart your development!
    <br />
    <a href="https://github.com/TheTrustyPwo/discordjs-bot-template/issues">Report Bug</a>
    ·
    <a href="https://github.com/TheTrustyPwo/discordjs-bot-template/issues">Request Feature</a>
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

This is a Discord.js bot template written in node.js for easy discord bot development.

Here's why this template stands out:
* Custom errors and warnings logging system
* Quick and easy slash command creation (With tons of configurable options)
* Codebase is easily expandable to suit your needs

<p align="right">(<a href="#top">back to top</a>)</p>



### Built With

* [Node.js](https://nodejs.org/)

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

Below shows how you can set up the project locally.

### Prerequisites

Make sure you have the following software installed
* npm
  ```sh
  npm install npm@latest -g
  ```
* NodeJS v16.6+

### Installation

This shows how you can use the template.

1. Create an application at [https://discord.com/developers/applications](https://discord.com/developers/applications)
2. Create a bot within the application and copy the bot token
3. Click `OAuth2` > `URL Generator`
4. Check `applications.commands` & `bot` under `Scopes`
5. Check whichever permissions your bot will require under `Bot Permissions`
6. Copy the `Generated URL` and invite the bot to a server
7. Clone the repo
   ```sh
   git clone https://github.com/TheTrustyPwo/discordjs-bot-template.git
   ```
8. Install NPM packages
   ```sh
   npm install
   ```
9. Navigate to `config.js` and set the bot token, bot admin IDs and the test guild ID
   ```js
    module.exports = {
        BOT_TOKEN: "CHANGE THIS",
        ADMIN_IDS: ["CHANGE THIS",], // Bot admin ID's
        INTERACTIONS: {
            SLASH: true, // Should the interactions be enabled
            CONTEXT: true, // Should contexts be enabled
            GLOBAL: false, // Should the interactions be registered globally
            TEST_GUILD_ID: "CHANGE THIS", // Guild ID where the interactions should be registered. [** Test you commands here first **]
        },
        /* Bot Embed Colors */
        EMBED_COLORS: {
            DEFAULT: "#FF8C00",
            SUCCESS: "#00FF00",
            ERROR: "#D61A3C",
            WARNING: "#F7E919",
        },
    };
    ```
10. Start the bot
    ```sh
    node index.js
    ```

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- USAGE EXAMPLES -->
## Usage

#### Custom Slash Commands
For this tutorial, we will be creating a simple `/say <message>` command which will echo the message specified by the user
1. Navigate to `src/commmands`
2. Create a directory which will be the command category (For this tutorial, we'll be using `utility`)
3. Create a new Javascript file under the directory, name of the file will be the command name
4. Copy this code into the file that you have just created
```js
const { CommandInteraction } = require("discord.js");
const { Command } = require("../../structures");

module.exports = class SayCommand extends Command {
    constructor(client) {
        super(client, {
            name: "say", // Name of the command (Must be in lowercase)
            description: "Echoes the message", // Slash command description
            category: "UTILITY", // Command category; Must be defined in src/Structures/CommandCategory.js
            enabled: true,
            options: [ // Basically the command parameters
                {
                    name: "message", // Name & Identifier
                    description: "The message to echo", // Description
                    type: "STRING", // Type, 
                    // {USER|ROLE|NUMBER|STRING|BOOLEAN|INTEGER|CHANNEL|MENTIONABLE|SUB_COMMAND|SUB_COMMAND_GROUP}
                    // https://discordjs.guide/interactions/slash-commands.html#option-types
                    required: true, // If false, it does not need to be specified in order for the command to run
                },
            ],
        });
    }

    /**
     * @param {CommandInteraction} interaction
     */
    async interactionRun(interaction) {
        
    }
}
```
The above code basically sets up the command framework for our `/say <message>` command. The `interactionRun` is the function that will run when the command is triggered, so we will be adding code to handle the command in the next step.
5. Add the following code under the `interactionRun` function
```js
const message = interaction.options.getString("message")// Gets the value from the 'message' option
await interaction.followUp(message); // Follows up the interaction response with the message, essentially echoing it
```
6. Restart the bot and your command should be registered successfully!


### Registering Events
For this tutorial, we will be listening to the `guildMemberAdd` event and automatically give the user a role when they join the server.
1. Navigate to `src/events`
2. Create a directory named `member` and within the folder, create a javascript file named `guildMemberAdd` (File name must be exactly the same as the event name)
3. Add the following code into the file
```js
const autoRole = "YOUR AUTOROLE ID"; // AutoRole ID

/**
 * @param {import("../../structures").BotClient} client
 * @param {import("discord.js").GuildMember} member
 */
module.exports = async (client, member) => {
    if (!member || !member.guild) return; // Undefined member or guild

    const { guild } = member; // Get the guild
    const role = guild.roles.cache.get(settings.autorole); // Getting the role by ID
    if (role) member.roles.add(role).catch((err) => { // Give the role to the member 
        // Catch the error, if any
    });
}
```
4. Restart the bot and the event should be successfully registered!

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- CONTACT -->
## Contact

TheTrustyPwo - Pwo#0001 - thetrustypwo@gmail.com

Project Link: [https://github.com/TheTrustyPwo/discordjs-bot-template](https://github.com/TheTrustyPwo/discordjs-bot-template)

<p align="right">(<a href="#top">back to top</a>)</p>


<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/TheTrustyPwo/discordjs-bot-template.svg?style=for-the-badge
[contributors-url]: https://github.com/TheTrustyPwo/discordjs-bot-template/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/TheTrustyPwo/discordjs-bot-template.svg?style=for-the-badge
[forks-url]: https://github.com/TheTrustyPwo/discordjs-bot-template/network/members
[stars-shield]: https://img.shields.io/github/stars/TheTrustyPwo/discordjs-bot-template.svg?style=for-the-badge
[stars-url]: https://github.com/TheTrustyPwo/discordjs-bot-template/stargazers
[issues-shield]: https://img.shields.io/github/issues/TheTrustyPwo/discordjs-bot-template.svg?style=for-the-badge
[issues-url]: https://github.com/TheTrustyPwo/discordjs-bot-template/issues
[license-shield]: https://img.shields.io/github/license/TheTrustyPwo/discordjs-bot-template.svg?style=for-the-badge
[license-url]: https://github.com/TheTrustyPwo/discordjs-bot-template/blob/master/LICENSE.txt
