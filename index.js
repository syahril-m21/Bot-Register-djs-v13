//
const express = require('express');
const app = express();
const port = process.env.PORT || '8080';

app.get('/', function (req, res) {
  res.send('ready!');
});

app.listen(port, () => console.info(`Listening on port ${port}`));

//package
const { Client, Collection, Intents } = require('discord.js');
const { readdirSync } = require('fs');
const { TOKEN } = require('./util/config.json');

//client
const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.DIRECT_MESSAGES,
    Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
    Intents.FLAGS.DIRECT_MESSAGE_TYPING,
    Intents.FLAGS.GUILD_BANS,
    Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
    Intents.FLAGS.GUILD_INTEGRATIONS,
    Intents.FLAGS.GUILD_INVITES,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGE_TYPING,
    Intents.FLAGS.GUILD_VOICE_STATES,
    Intents.FLAGS.GUILD_WEBHOOKS,
    Intents.FLAGS.GUILD_PRESENCES,
  ],
  allowedMentions: { parse: ['users', 'roles'], repliedUser: true },
  restTimeOffset: 0,
});

// commands
client.commands = new Collection();

// events & handling
const eventFiles = readdirSync('./events').filter((file) => file.endsWith('.js'));
const commandFolders = readdirSync('./commands');

// events
for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client));
  } else {
    client.on(event.name, (...args) => event.execute(...args, client));
  }
}

// handling
for (const folder of commandFolders) {
  const commandFiles = readdirSync(`./commands/${folder}`).filter((file) => file.endsWith('.js'));
  for (const file of commandFiles) {
    const command = require(`./commands/${folder}/${file}`);
    client.commands.set(command.name, command);
  }
}

// warn & error
client.on('warn', console.warn);
client.on('error', console.error);

//token
client.login(TOKEN);
