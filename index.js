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
const Sentry = require('@sentry/node');
Sentry.init({ dsn: client.config.errorlogging });
process.on('unhandledRejection', error => {
    $console.error(error.stack);
    // catch js necessary because if sentry rejects it will create a infitite loop.
    Sentry.captureException(error.stack).catch(err => $console.error(err));
});
process.on('uncaughtException', error => {
    $console.error(error.stack);
    Sentry.captureException(error.stack).catch(err => $console.error(err));
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

client.login(client.config.token);