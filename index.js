const Discord = require("discord.js");
const fetch = require("node-fetch");
const fs = require("fs");
const config = require("./config");

const musicPromote = require("./misc/music-promote");

if (process.env.CONFIG_JSON && !fs.existsSync("./config.json")) {
  fs.writeFileSync("./config.json", process.env.CONFIG_JSON);
}

const client = new Discord.Client();
const { prefix, token } = require("./config.json");

client.commands = new Discord.Collection();
const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));

for (const commandFile of commandFiles) {
  const command = require(`./commands/${commandFile}`);
  client.commands.set(command.name, command);
}

client.on("ready", () => {
  client.user.setActivity("Posei", { type: "LISTENING" });
});

const cooldowns = new Discord.Collection();

client.once("ready", () => {
  console.log("Logged in as " + client.user.tag);
});

client.on("message", async (message) => {
  // #music-promote auto playlist
  if (
    message.channel.id === config.settings.music_promote.channelId &&
    (message.content.includes("youtube.com") ||
      message.content.includes("youtu.be") || message.content.includes("music.youtube"))
  ) {
    const re = /https:\/\/((music|www)\.youtube\.com\/watch\?v=|youtu\.be\/)([0-9a-zA-Z_-]{11})/g;
    const videoIds = message.content
      .match(re)
      .map((m) => m.substr(m.length - 11));
    for (const videoId of videoIds) await musicPromote.insertPlaylist(videoId);
    return;
  }

  // Command handling
  if (!message.content.startsWith(prefix)) return;
  const args = message.content.slice(prefix.length).split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command =
    client.commands.get(commandName) ||
    client.commands.find(
      (cmd) => cmd.aliases && cmd.aliases.includes(commandName)
    );

  if (!command) return;

  if (command.guildOnly && message.channel.type !== "text")
    return message.reply("I can't execute that command inside DMs!");

  if (command.args && !args.length) {
    let reply = `You didn't provide any arguments, ${message.author}!`;
    if (command.usage)
      reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
    return message.channel.send(reply);
  }

  if (!cooldowns.has(command.name))
    cooldowns.set(command.name, new Discord.Collection());

  // variable now with the current timestamp.
  // variable timestamps that .get()s the Collection for the triggered command.
  // variable cooldownAmount that gets the necessary cooldown amount
  const now = Date.now();
  const timestamps = cooldowns.get(command.name);
  const cooldownAmount = (command.cooldown || 3) * 1000;

  if (timestamps.has(message.author.id)) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
    // Since the timestamps Collection has the author ID in it, you .get() it and then sum it up with the cooldownAmount variable, in order to get the correct expiration timestamp. You then check to see if it's actually expired or not.
    if (now < expirationTime) {
      // If the expirationTime has not passed, you return a message letting the user know how much time is left until they can use that command again.
      const timeLeft = (expirationTime - now) / 1000;
      // if the timestamps Collection doesn't have the message author's ID (or if the author ID did not get deleted as planned), .set() the author ID with the current timestamp and create a setTimeout() to automatically delete it after the cooldown period has passed:
      return message.reply(
        `please wait ${timeLeft.toFixed(
          1
        )} more second(s) before reusing the \`${command.name}\` command.`
      );
    }
  }

  timestamps.set(message.author.id, now);
  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

  try {
    command.execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply(
      "oopsie whoopsie uwu i did a fucky wucky. something went wrong while trying to run the command:\n```" +
        error.toString() +
        "\n```"
    );
  }
});

client.on("shardError", (error) => {
  console.error("A websocket connection encountered an error:", error);
});

process.on("unhandledRejection", (error) => {
  console.error("Unhandled promise rejection:", error);
});

client.login(token);
