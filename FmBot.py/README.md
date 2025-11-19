# Install FmBot.py


---

## 🇫🇷 Instructions en Français

Ce projet nécessite deux fichiers pour fonctionner :  
`bot.py` et `requirements.txt`.

### 1. Créer le fichier `bot.py`

Crée un fichier nommé **bot.py** à la racine du projet.  
Il doit contenir ton code du bot Discord.

Exemple minimal :

```python
import discord

client = discord.Client(intents=discord.Intents.default())

@client.event
async def on_ready():
    print(f"Connecté en tant que {client.user}")

client.run("TON_TOKEN_ICI")
```
Pour requirements.txt :
```
discord.py==2.3.2
```

## 🇬🇧 Instructions in English

This project requires two files to run:
`bot.py` and `requirements.txt`.

### 1. Create the `bot.py`file

Create a file named **bot.py** at the root of the project.
It must contain your Discord bot code.

Minimal example:

```python
import discord

client = discord.Client(intents=discord.Intents.default())

@client.event
async def on_ready():
    print(f"Logged in as {client.user}")

client.run("YOUR_TOKEN_HERE")
```
for requirements.txt :
```
discord.py==2.3.2
```
