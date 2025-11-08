require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const { Manager } = require("erela.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// Configuration Lavalink
client.manager = new Manager({
  nodes: [
    {
      host: "10.0.20.5",
      port: 2333,
      password: "youshallnotpass",
      secure: false
    }
  ],
  send: (id, payload) => {
    const guild = client.guilds.cache.get(id);
    if (guild) guild.shard.send(payload);
  }
});

// Événements Lavalink
client.manager.on("nodeConnect", node =>
  console.log(`✅ Connecté à Lavalink ${node.options.host}:${node.options.port}`)
);

client.manager.on("nodeError", (node, error) =>
  console.log(`❌ Erreur Lavalink ${node.options.host}:${node.options.port} → ${error.message}`)
);

// Événements Discord
client.once("ready", () => {
  console.log(`🤖 Bot connecté en tant que ${client.user.tag}`);
  client.manager.init(client.user.id);
});

client.on("raw", d => client.manager.updateVoiceState(d));

// Commande basique $play
client.on("messageCreate", async message => {
  if (message.author.bot || !message.content.startsWith("$")) return;
  const args = message.content.slice(1).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === "play") {
    const channel = message.member.voice.channel;
    if (!channel)
      return message.reply("❗ Tu dois être dans un salon vocal.");

    const player = client.manager.create({
      guild: message.guild.id,
      voiceChannel: channel.id,
      textChannel: message.channel.id,
      selfDeafen: true
    });

    if (player.state !== "CONNECTED") player.connect();

    const search = args.join(" ");
    if (!search) return message.reply("⚠️ Donne un lien ou un nom de musique.");

    const res = await client.manager.search(search, message.author);
    if (res.loadType === "LOAD_FAILED" || !res.tracks.length)
      return message.reply("❌ Aucun résultat trouvé.");

    player.queue.add(res.tracks[0]);
    message.reply(`🎶 Ajouté à la file : **${res.tracks[0].title}**`);

    if (!player.playing && !player.paused && !player.queue.size)
      player.play();
  }

  if (command === "skip") {
    const player = client.manager.players.get(message.guild.id);
    if (!player) return message.reply("❌ Aucun lecteur actif.");
    player.stop();
    message.reply("⏭️ Morceau passé.");
  }

  if (command === "stop") {
    const player = client.manager.players.get(message.guild.id);
    if (!player) return message.reply("❌ Aucun lecteur actif.");
    player.destroy();
    message.reply("🛑 Lecture arrêtée.");
  }
});

// Lancement du bot
client.login(process.env.DISCORD_TOKEN || "TON_TOKEN_ICI");
