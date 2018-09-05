const $console = require('Console');
const heapdump = require('heapdump');
const Discord = require('discord.js');
module.exports = async (client) => {
    let counter = 0;
    let ramovermax = false;
    $console.success(`client is ready after ${process.uptime() * 1000 - client.uptime} Milliseconds`);
    $console.success(`${client.channels.size} channels on ${client.guilds.size} servers, for a total of ${client.guilds.map(g => g.memberCount).reduce((a, b) => a + b)} users.`);
    $console.log(`logged in as ${client.user.tag}`);
    setInterval(changing_status, 12001);
    setInterval(() => {
        const max = 500;
        const usage = process.memoryUsage().rss / 1024 / 1024 * 100 / 100;
        if (usage > max && !ramovermax) {
            ramovermax = true;
            $console.warn(`This process uses more than ${max}MB RAM!`);
            $console.stress(`RAM Usage: ${usage}MB`);
            heapdump.writeSnapshot(`./heapdump/${Date.now()}.heapsnapshot`, function (err, filename) {
                $console.success('dump written to', filename);
            });
            client.channels.get('461211772804792320').send(new Discord.RichEmbed()
                .setColor(client.config.cw)
                .setFooter(`RAM Usage: ${usage}`)
                .setDescription(`RAM Usage is \`${Math.round(usage / max)}\` the limit (${max} MB)`));
        }
    }, 5000);
    function changing_status() {
        const status = [`${client.guilds.size} Guilds`, 'Tag me for Info', `${client.guilds.map(g => g.memberCount).reduce((a, b) => a + b)} Users`, `${client.channels.size} Channels`];
        counter++;
        if (counter == status.length) counter = 0;
        client.user.setActivity(status[counter]);
    }
    // Start the check if any user has to be unmuted
    if (!client.settings.has('mutes')) {
        client.settings.set('mutes', {
            users_tempmute: 0,
            users_muted_ids: [],
        });
    }
    setInterval(async () => {
        let times = client.settings.getProp('mutes', 'users_tempmute');
        const userinfo = client.settings.getProp('mutes', 'users_muted_ids');
        for (let i = 0; i < times * 3; i += 3) {
            if (parseInt(userinfo[i + 1]) > parseInt((new Date()).getTime())) continue;
            if (!client.guilds.has(userinfo[i + 2])) continue;
            const guild2f = client.guilds.get(userinfo[i + 2]);
            if (!guild2f.me.permissions.has('MANAGE_ROLES')) continue;
            const futoMute = guild2f.member(userinfo[i]);
            const fumuterole = guild2f.roles.find(r => r.name === 'muted by Automaton');
            if (fumuterole && futoMute.roles.has(fumuterole.id)) {
                await futoMute.removeRole(fumuterole);
            }
            userinfo.splice(i, 3);
            times -= 1;
            client.settings.setProp('mutes', 'users_muted_ids', userinfo);
            client.settings.setProp('mutes', 'users_tempmute', times);
        }
    }, 10000);
};