const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');
const $console = require('Console');
const config = require('./config.json');
const Enmap = require('enmap');
const antispam = require('./modules/anti-spam.js');
const Lookup = require('./modules/lookup.js').Lookup;

$console.success(`Process started at ${new Date(Date.now())}`);
client.config = config;
client.dbans = new Lookup(client.config.dbanstoken);
client.settings = new Enmap({
    name: 'settings',
});
client.userp = new Enmap({
    name: 'userpoints',
    fetchAll: false,
});
client.reactsave = new Enmap({
    name: 'reactsave',
});

process.on('unhandledRejection', error => {
    $console.error(`Uncaught Promise Error: \n${error.stack}`);
});
antispam(client);
// Its the well loved Soon™
fs.readdir('./events/', (err, files) => {
    let eventssize = 0;
    if (err) return $console.error(err);
    files.forEach(file => {
        eventssize++;
        const event = require(`./events/${file}`);
        const eventName = file.split('.')[0];
        client.on(eventName, event.bind(null, client));
    });
    $console.success(`loaded ${eventssize} events`);
});

client.commands = new Enmap();
fs.readdir('./cmds/', (err, files) => {
    let cmds = 0;
    if (err) return console.error(err);
    files.forEach(file => {
        if (!file.endsWith('.js')) return;
        const props = require(`./cmds/${file}`);
        const commandName = file.split('.')[0];
        cmds++;
        client.commands.set(commandName, props);
    });
    $console.success(`loaded ${cmds} commands`);
});


client.login(config.token);