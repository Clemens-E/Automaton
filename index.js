const Discord = require('discord.js');
const modified = require('./struct/extend.js');
const client = new modified();
const fs = require('fs');
const $console = require('Console');
const Enmap = require('enmap');
const antispam = require('./modules/anti-spam.js');
const Lookup = require('./modules/lookup.js').Lookup;
$console.success(`Process started at ${new Date(Date.now())}`);
client.config = require('./config.json');
client.infos = require('./infos.json');
client.dbans = new Lookup(client.config.dbanstoken);
Object.assign(client, Enmap.multi(['settings', 'reactsave', 'premium', 'warns']));
client.userp = new Enmap({
    name: 'userpoints',
    fetchAll: false,
});


process.on('unhandledRejection', error => {
    $console.error(error.stack);
    if (client.ready) {
        const channel = client.channels.get(client.infos.promise_rejections_channel);
        channel.send(new Discord.RichEmbed().setDescription(error.stack).setTitle(error.message).setColor(client.infos.ce).setTimestamp()).catch((O_o) => O_o);
    }
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

client.login(config.token);