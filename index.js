const modified = require('./struct/extend.js');
const client = new modified();
const fs = require('fs');
const $console = require('Console');
const Enmap = require('enmap');
const antispam = require('./modules/anti-spam.js');
const Lookup = require('./modules/lookup.js').Lookup;
const http = require('http');
const dm = require('discord-dmsupport');
$console.success(`Process started at ${new Date(Date.now())}`);
client.dm = new dm(client, '459044079183855626', '461543183252324363', true);
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
});
process.on('uncaughtException', error => {
    $console.error(error.stack);
    process.exit(1);
});
antispam(client);
fs.readdir('./events/', (err, files) => {
    let eventssize = 0;
    if (err) return $console.error(err);
    files.forEach(file => {
        if (!file.endsWith('.js')) return;
        const event = require(`./events/${file}`);
        const eventName = file.split('.')[0];
        eventssize++;
        client.on(eventName, event.bind(null, client));
    });
    $console.success(`loaded ${eventssize} events`);
});

client.commands = new Enmap();
fs.readdir('./cmds/', (err, files) => {
    if (err) return $console.error(err);
    files.forEach(file => {
        if (!file.endsWith('.js')) return;
        const props = require(`./cmds/${file}`);
        const commandName = file.split('.')[0];
        client.commands.set(commandName, props);
    });
    $console.success(`loaded ${client.commands.size} commands`);
});

// Listen on http requests for uptime robot
client.login(client.config.token);
http.createServer((req, res) => {
    res.writeHead(200, {
        'Content-Type': 'text/html',
    });
    res.write(`Beep Beep Boop! ${client.user.tag} works.`);
    res.end();
}).listen(3000);