require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const { Poru } = require("poru");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// === Nœuds Lavalink ===
const nodes = [
  {
    name: "Local",
    host: "127.0.0.1",
    port: 2333,
    password: "youshallnotpass",
    secure: false
  }
];

// === Initialisation Poru ===
const poru = new Poru(client, nodes, { library: "discord.js" });

// === Logs ===
poru.on("nodeConnect", (node) => console.log(`✅ Connecté à ${node.name}`));
poru.on("nodeError", (node, err) => console.error(`❌ Erreur ${node.name}:`, err.message));

// === Commandes simples ===
client.on("messageCreate", async (msg) => {
  if (msg.author.bot || !msg.content.startsWith("$")) return;

  const args = msg.content.slice(1).trim().split(/ +/);
  const command = args.shift().toLowerCase();
  const voice = msg.member?.voice?.channel;
  if (!voice) return msg.reply("Rejoins un salon vocal d’abord.");

  let player = poru.players.get(msg.guild.id);
  if (!player)
    player = poru.createConnection({
      guildId: msg.guild.id,
      voiceChannel: voice.id,
      textChannel: msg.channel.id
    });

  if (command === "play") {
    const query = args.join(" ");
    if (!query) return msg.reply("Donne un lien ou un titre de musique.");
    const resolve = await poru.resolve({ query, source: "ytsearch" });
    if (!resolve.tracks.length) return msg.reply("Aucun résultat trouvé.");
    const track = resolve.tracks[0];
    player.queue.add(track);
    if (!player.isPlaying && !player.isPaused) player.play();
    msg.reply(`🎶 Lecture : **${track.info.title}**`);
  }

  if (command === "skip") {
    if (!player || !player.isPlaying) return msg.reply("Aucune musique en cours.");
    player.stop();
    msg.reply("⏭️ Morceau passé.");
  }

  if (command === "stop") {
    if (!player) return msg.reply("Aucun lecteur actif.");
    player.destroy();
    msg.reply("🛑 Lecture arrêtée.");
  }
});

client.once("ready", () => console.log(`🤖 Connecté à Discord en tant que ${client.user.tag}`));
client.login(process.env.DISCORD_TOKEN);
