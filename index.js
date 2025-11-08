require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const { Shoukaku, Connectors } = require("shoukaku");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// === Lavalink via Shoukaku ===
const shoukaku = new Shoukaku(new Connectors.DiscordJS(client), [
  {
    name: "Local",
    url: "127.0.0.1:2333",
    auth: "youshallnotpass"
  }
]);

// Logs Lavalink
shoukaku.on("ready", (name) => console.log(`✅ Lavalink node "${name}" prêt`));
shoukaku.on("error", (name, err) => console.error(`❌ Node ${name} erreur: ${err.message}`));
shoukaku.on("close", (name, code, reason) => console.log(`🔌 Node ${name} fermé: ${code} ${reason || "Aucune raison"}`));

client.once("ready", () => {
  console.log(`🤖 Connecté à Discord en tant que ${client.user.tag}`);
});

// === Commande simple $play / $skip / $stop ===
client.on("messageCreate", async (msg) => {
  if (msg.author.bot || !msg.content.startsWith("$")) return;

  const args = msg.content.slice(1).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === "play") {
    const voice = msg.member?.voice?.channel;
    if (!voice) return msg.reply("❗ Rejoins un salon vocal d’abord.");

    const node = shoukaku.getNode();
    const connection = await node.joinChannel({
      guildId: msg.guild.id,
      channelId: voice.id,
      shardId: 0,
      deaf: true
    });

    const query = args.join(" ");
    if (!query) return msg.reply("⚠️ Donne un lien ou un nom de musique.");

    const result = await node.rest.resolve(query);
    if (!result?.tracks?.length) return msg.reply("❌ Aucun résultat trouvé.");

    const track = result.tracks[0];
    await connection.playTrack({ track: track.encoded });
    msg.reply(`🎶 Lecture : **${track.info.title}**`);
  }

  if (command === "skip") {
    const node = shoukaku.getNode();
    const conn = node.players.get(msg.guild.id);
    if (!conn) return msg.reply("❌ Aucun titre en cours.");
    conn.stopTrack();
    msg.reply("⏭️ Morceau passé.");
  }

  if (command === "stop") {
    const node = shoukaku.getNode();
    const conn = node.players.get(msg.guild.id);
    if (!conn) return msg.reply("❌ Aucun lecteur actif.");
    conn.disconnect();
    msg.reply("🛑 Lecture arrêtée.");
  }
});

// === Connexion Discord ===
client.login(process.env.DISCORD_TOKEN || "TON_TOKEN_ICI");
