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
Object.assign(client, Enmap.multi(['settings', 'reactsave']));
client.userp = new Enmap({
    name: 'userpoints',
    fetchAll: false,
});

process.on('unhandledRejection', error => {
    $console.error(`Uncaught Promise Error: \n${error.stack}`);
});
antispam(client);
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

client.logchannel = (guildid) => {
    if (typeof guildid !== 'string') throw 'channel must be a string.';
    const logchannel = client.channels.get(client.settings.getProp(guildid, 'log_channel'));
    if (logchannel && !logchannel.permissionsFor(client.user).has('SEND_MESSAGES')) return undefined;
    return logchannel;
};

client.login(config.token);