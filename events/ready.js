const $console = require('Console');
const heapdump = require('heapdump');
const Discord = require('discord.js');
module.exports = async (client) => {
    client.ready = true;
    if (client.settings.has('lastMessage')) {
        const dat = client.settings.get('lastMessage');
        const msg = await client.channels.get(dat.channel).fetchMessage(dat.msg);
        msg.edit(`\`\`\`css\n${dat.content}\`\`\`*restart completed*`);
        client.settings.delete('lastMessage');
    }
    let ramovermax = false;
    $console.success(`client is ready after ${process.uptime() * 1000 - client.uptime} Milliseconds`);
    $console.success(`${client.channels.size} channels on ${client.guilds.size} servers, for a total of ${client.guilds.map(g => g.memberCount).reduce((a, b) => a + b)} users.`);
    $console.log(`logged in as ${client.user.tag}`);

    setInterval(() => {
        const max = 500;
        const usage = process.memoryUsage().rss / 1024 / 1024 * 100 / 100;
        if (usage > max && !ramovermax) {
            ramovermax = true;
            $console.warn(`This process uses more than ${max}MB RAM!`);
            $console.stress(`RAM Usage: ${usage}MB`);
            heapdump.writeSnapshot(`../heapdump/${Date.now()}.heapsnapshot`, function (err, filename) {
                $console.success('dump written to', filename);
            });
            client.channels.get('461211772804792320').send(new Discord.RichEmbed()
                .setColor(client.infos.cw)
                .setFooter(`RAM Usage: ${usage}`)
                .setDescription(`RAM Usage is \`${Math.round(usage / max)}\` the limit (${max} MB)`));
        }
    }, 5000);

    // Start the check if any user has to be unmuted
    setInterval(async () => {
        if (!client.settings.has('mutes')) {
            client.settings.set('mutes', {
                users_tempmute: 0,
                users_muted_ids: [],
            });
        }
        let times = client.settings.getProp('mutes', 'users_tempmute');
        const userinfo = client.settings.getProp('mutes', 'users_muted_ids');
        for (let i = 0; i < times * 3; i += 3) {
            const guild = client.guilds.get(userinfo[i + 2]);
            if (!guild || !guild.me.permissions.has('MANAGE_ROLES')) continue;
            let member;
            member = await guild.fetchMember(userinfo[i]).catch(() => member = undefined);
            if (!member) continue;
            const muteRole = guild.roles.find(r => r.name === 'muted by Automaton');
            if (!muteRole) continue;
            if (muteRole.comparePositionTo(guild.me.highestRole) >= 0) continue;
            if (parseInt(userinfo[i + 1]) > Date.now()) {
                if (!member.roles.has(muteRole.id)) await member.addRole(muteRole);
            } else {
                if (member.roles.has(muteRole.id)) await member.removeRole(muteRole);
                userinfo.splice(i, 3);
                times -= 1;
                client.settings.setProp('mutes', 'users_muted_ids', userinfo);
                client.settings.setProp('mutes', 'users_tempmute', times);
            }
        }
    }, 3000);
    let counter = 0;
    const status = [`${client.guilds.size} Guilds`, 'Tag me for Info', `${client.guilds.map(g => g.memberCount).reduce((a, b) => a + b)} Users`, `${client.channels.size} Channels`];
    setInterval(changing_status, 12001);

    function changing_status() {
        counter++;
        if (counter == status.length) counter = 0;
        client.user.setActivity(status[counter]);
    }
};