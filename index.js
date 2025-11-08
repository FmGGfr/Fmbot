require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

const prefix = process.env.BOT_PREFIX || "$";

client.once("ready", () => {
  console.log(`Connecté en tant que ${client.user.tag}`);
});

client.on("messageCreate", message => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === "ping") {
    message.channel.send("Pong!");
  }

  if (command === "hello") {
    message.channel.send(`Salut ${message.author.username} !`);
  }
});

client.login(process.env.DISCORD_TOKEN);
