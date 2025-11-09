# 🎵 FmBot — Red Discord Music Bot

**Red Discord Bot** (without built-in Lavalink)  
A modular, powerful music bot based on [Red-DiscordBot](https://docs.discord.red/en/stable/).

> 💡 After the first startup, run this command in Discord:
> ```
> <prefix>llset external
> ```
> to make the bot use your **external Lavalink** server.

---

## ⚙️ Essential Commands

### 🎶 Music Playback
| Command | Description |
|----------|--------------|
| `<p>play <url or title>` | Plays a track from YouTube, SoundCloud, etc. |
| `<p>pause` | Pauses the current track. |
| `<p>resume` | Resumes playback. |
| `<p>skip` | Skips to the next track in queue. |
| `<p>stop` | Stops playback and clears the queue. |
| `<p>queue` | Shows the current song queue. |
| `<p>np` | Displays the currently playing track. |
| `<p>remove <number>` | Removes a specific song from the queue. |

---

### 🔊 Volume Control
| Command | Description |
|----------|--------------|
| `<p>volume <0-150>` | Sets the current playback volume. |
| `<p>maxvolume <value>` | Sets the maximum allowed volume. |

---

### 🧹 Audio Management
| Command | Description |
|----------|--------------|
| `<p>disconnect` | Makes the bot leave the voice channel. |
| `<p>restart` | Restarts the Lavalink connection. |
| `<p>audioset` | Configures audio options (DJ mode, auto-disconnect, etc.). |

---

### 🧩 Useful Modules
| Module | Purpose |
|---------|----------|
| **Downloader** | Install new cogs from GitHub repositories. |
| **Audio** | Manage music playback, Lavalink, and playlists. |
| **Core** | Main Redbot commands and utilities. |

---

## 📖 Full Documentation
👉 [Redbot Docs — Audio Commands]([https://docs.discord.red/en/stable/cog_audio/#commands](https://docs.discord.red/en/stable/cog_guides/audio.html))  
👉 [Lavalink Setup Guide](https://github.com/lavalink-devs/Lavalink)

---

## 🧠 Tip
Install new cogs easily:
| `<p>cog install downloader <Name_of_cog>` |
