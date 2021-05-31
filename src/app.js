/**
 * Discord Welcome bot
 * Copyright (c) 2021 The BaalKrshna Team and Contributors
 * Licensed under Lesser General Public License v2.1 (LGPl-2.1 - https://opensource.org/licenses/lgpl-2.1.php)
 */
const Discord = require("discord.js");

const result = require("dotenv").config();
if (result.error) {
    console.error(result.error);
}
//console.log(result.parsed);

const client = new Discord.Client();
const prefix = "!w ";
const presence = function () {
    const servers = client.guilds.cache.size;
    console.log(`Updating presence. Servers: ${servers}`);
    client.user
        .setPresence({
            activity: {
                name: `${servers} server${servers > 1 ? "s" : ""}`,
                type: "WATCHING",
            },
        })
        .catch((error) => console.error(error));
};

client.on("ready", () => {
    // We logged in
    console.log(`Logged in as ${client.user.tag}!`);
    presence();
    // 15 * 60 * (1 second)
    // Update presence every 15 minutes
    setInterval(() => presence(), 15 * 60 * 1000);
});

client.on("guildMemberAdd", (member) => {
    // When a new member joins
    let channel;
    channel = member.guild.channels.cache.find((ch) => ch.name === "welcome");
    if (!channel) {
        channel = member.guild.channels.cache.find(
            (ch) => ch.name === "general"
        );
    }
    if (!channel) return;
    console.log(channel);
    channel.send(`Welcome, ${member}`);
});

client.on("message", function (message) {
    if (message.author.bot) return;
    if (message.mentions.has(client.user)) {
        message.channel.send(
            `Hi there, ${message.author}\nMy prefix is ${prefix.trim()}`
        );
    }
    if (!message.content.startsWith(prefix)) return;

    const commandBody = message.content.slice(prefix.length);
    const args = commandBody.split(" ");
    const command = args.shift().toLowerCase();
    if (command === "ping") {
        message.reply(`Pong!`);
    }
});

// Login
client.login(process.env.BOT_TOKEN);
