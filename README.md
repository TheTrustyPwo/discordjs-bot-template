[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]



<!-- PROJECT LOGO -->
<br />
<div align="center">

<h3 align="center">Discord.js Bot Template</h3>

  <p align="center">
    An awesome Discord.js Bot Template to jumpstart your development!
    <br />
    <a href="https://github.com/othneildrew/Best-README-Template"><strong>Explore the docs »</strong></a>
    <br />
    <a href="https://github.com/othneildrew/Best-README-Template/issues">Report Bug</a>
    ·
    <a href="https://github.com/othneildrew/Best-README-Template/issues">Request Feature</a>
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
* Discord.js v13
  ```sh
  npm install discord.js@latest
  ```

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

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- USAGE EXAMPLES -->
## Usage

#### Creating your own slash command
*Coming soon*

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
[contributors-shield]: https://img.shields.io/github/contributors/othneildrew/Best-README-Template.svg?style=for-the-badge
[contributors-url]: https://github.com/othneildrew/Best-README-Template/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/othneildrew/Best-README-Template.svg?style=for-the-badge
[forks-url]: https://github.com/othneildrew/Best-README-Template/network/members
[stars-shield]: https://img.shields.io/github/stars/othneildrew/Best-README-Template.svg?style=for-the-badge
[stars-url]: https://github.com/othneildrew/Best-README-Template/stargazers
[issues-shield]: https://img.shields.io/github/issues/othneildrew/Best-README-Template.svg?style=for-the-badge
[issues-url]: https://github.com/othneildrew/Best-README-Template/issues
[license-shield]: https://img.shields.io/github/license/othneildrew/Best-README-Template.svg?style=for-the-badge
[license-url]: https://github.com/othneildrew/Best-README-Template/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/othneildrew
[product-screenshot]: images/screenshot.png