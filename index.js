require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const { LavalinkManager } = require("lavalink-client");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const manager = new LavalinkManager({
  nodes: [
    {
      authorization: process.env.LAVALINK_PASSWORD,
      host: process.env.LAVALINK_HOST,
      port: parseInt(process.env.LAVALINK_PORT, 10),
      id: "MainNode",
      secure: false
    }
  ],
  sendToShard: (id, payload) => {
    const guild = client.guilds.cache.get(id);
    if (guild) guild.shard.send(payload);
  }
});

client.once("ready", () => {
  console.log(`🤖 Connecté à Discord en tant que ${client.user.tag}`);
  manager.init(client.user.id);
});

manager.on("nodeConnect", (node) =>
  console.log(`✅ Connecté à Lavalink: ${node.id}`)
);
manager.on("nodeError", (node, err) =>
  console.error(`❌ Erreur sur ${node.id}:`, err.message)
);

client.on("messageCreate", async (message) => {
  if (!message.content.startsWith("$") || message.author.bot) return;

  const args = message.content.slice(1).split(" ");
  const command = args.shift().toLowerCase();

  if (command === "play") {
    const voiceChannel = message.member?.voice?.channel;
    if (!voiceChannel)
      return message.reply("❗ Rejoins un salon vocal d’abord.");

    const player = manager.createPlayer({
      guildId: message.guild.id,
      voiceId: voiceChannel.id,
      textId: message.channel.id
    });

    const query = args.join(" ");
    const res = await player.search(query, {
      requester: message.author
    });

    if (!res.tracks.length) return message.reply("❌ Aucun résultat trouvé.");
    player.connect();
    player.queue.add(res.tracks[0]);
    if (!player.playing && !player.paused) player.play();
    message.reply(`🎶 Lecture : **${res.tracks[0].info.title}**`);
  }

  if (command === "skip") {
    const player = manager.players.get(message.guild.id);
    if (!player) return message.reply("Aucune lecture en cours.");
    player.skip();
    message.reply("⏭️ Morceau passé.");
  }

  if (command === "stop") {
    const player = manager.players.get(message.guild.id);
    if (!player) return message.reply("Aucun lecteur actif.");
    player.destroy();
    message.reply("🛑 Lecture arrêtée.");
  }
});

client.login(process.env.DISCORD_TOKEN);
