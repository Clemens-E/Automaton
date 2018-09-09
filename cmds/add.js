const $console = require('Console');
const Discord = require('discord.js');
module.exports.run = async (client, message, args) => {
    const guild = message.guild;
    const channel = message.channel;
    if (!channel.permissionsFor(guild.me).has('SEND_MESSAGES')) return message.author.send(`I can't send messages in ${channel}. Please make sure I can and try again.`);
    if (!client.reactsave.has(guild.id) || !client.settings.has(guild.id)) {
        message.author.send(':x: Something unexpected happened\nThe developer got a notification');
        channel.send(':x: Something unexpected happened\nThe developer got a notification');
        $console.stress('data for a server was not available');
        $console.error(`guild: ${guild.name}|${guild.id}\nreactsave: ${client.reactsave.has(guild.id)}\nsettings: ${client.settings.has(guild.id)}`);
        return;
    }
    const userperm = message.member.permissions;
    if (!userperm.has('MANAGE_ROLES')) return channel.send('You don\'t have enough permissions. You need\n`Manage Roles`\n');
    const template = args[0].toLowerCase();
    const messages = [];
    const premium = client.settings.getProp(guild.id, 'premium');
    let roletoadd;
    let emojitoadd;
    switch (template) {
        case 'one':
        case 'two':
            break;
        case 'three':
        case 'four':
            if (!premium) return channel.send('Sorry, you need premium to have more than 2 templates');
            break;
        default:
            return channel.send('I don\'t have that template.\nOnly `one`, `two`. (only premium):`three` and `four` ');
    }
    messages.push(message);
    messages.push(await channel.send('Please send the name of the role you want to choose. You have five minutes time. Type `//cancel` to cancel'));
    let time = new Date().getTime();
    let filter = m =>
        m.author.id === message.author.id;
    const mcollector = channel.createMessageCollector(filter, {
        time: 300000,
    });
    // Let that run until a valid rolename
    mcollector.on('collect', async (m) => {
        messages.push(m);
        if (m.content === '//cancel') return mcollector.stop();
        const possibleroles = guild.roles.filter(r => r.name === m.content);
        if (possibleroles.size === 0) return messages.push(await channel.send(`There is no role with the name \`${m.content}\`\nTry again! (${Math.floor((mcollector.options.time - (new Date().getTime() - time)) / 1000)} Seconds left)\n\`//cancel\` to cancel`));
        if (possibleroles.size > 1) return messages.push(await channel.send(`You have multiple roles with the name \`${m.content}\`. Please delete or rename one of them.\nTry again! (${Math.floor((mcollector.options.time - (new Date().getTime() - time)) / 1000)} Seconds left)\n\`//cancel\` to cancel`));
        if (possibleroles.first().comparePositionTo(message.member.highestRole) >= 0) return messages.push(await channel.send(`The role \`${possibleroles.first().name}\` has the same or higher position than you.`));
        if (possibleroles.first().comparePositionTo(guild.me.highestRole) >= 0) return messages.push(await channel.send(`The role \`${possibleroles.first().name}\` has the same or higher position than me.`));
        roletoadd = possibleroles.first().id;
        mcollector.stop();
    });

    mcollector.on('end', async () => {
        if (!roletoadd) {
            if (messages.length <= 99 && messages.length > 0) channel.bulkDelete(messages).catch((O_o) => O_o);
            return messages.push(await channel.send('Time went out or the command was cancelled. No role added'));
        }
        messages.push(await channel.send(`Role added\nName: \`${guild.roles.get(roletoadd).name}\`\nMember(s) with this role: ${guild.roles.get(roletoadd).members.size}`));
        const tmpmsg = await channel.send('Please react to this message with the emoji you want to bind with the role. You have one minute time.');
        messages.push(tmpmsg);
        filter = (r, u) => u.id === message.author.id;
        time = new Date().getTime();
        const rcollector = tmpmsg.createReactionCollector(filter, {
            time: 60000,
        });
        rcollector.on('collect', async (r) => {
            r.remove(r.users.last()).catch((O_o) => O_o);
            if (r.emoji.id && !client.emojis.has(r.emoji.id)) return messages.push(await channel.send(`Please use a emoji that is from this guild or a unicode emoji. Try again! (${Math.floor((rcollector.options.time - (new Date().getTime() - time)) / 1000)} Seconds left)`));
            const tmpone_emoji = client.reactsave.getProp(guild.id, `template_${template}_emoji`);
            const tmpone_role = client.reactsave.getProp(guild.id, `template_${template}_role`);
            if (tmpone_emoji.length !== 0 && (tmpone_emoji.find(v => v.includes(r.emoji.id)) || tmpone_emoji.find(v => v.includes(r.emoji.name)))) { return messages.push(await channel.send(`That emoji is already binded to ${guild.roles.get(tmpone_role[tmpone_emoji.indexOf(r.emoji.id || r.emoji.name)]).name}. Try again! (${Math.floor((rcollector.options.time - (new Date().getTime() - time)) / 1000)} Seconds left)`)); }
            emojitoadd = r.emoji.id || r.emoji.name;
            rcollector.stop();
        });
        rcollector.on('end', async () => {
            if (!emojitoadd) {
                if (messages.length <= 99 && messages.length > 0) channel.bulkDelete(messages).catch((O_o) => O_o);
                return channel.send('Time went out or the command was cancelled. No emoji added. Role removed');
            }
            channel.send(new Discord.RichEmbed()
                .setColor(client.config.ci)
                .setDescription(`Added \`${guild.roles.get(roletoadd).name}\` with ${guild.roles.get(roletoadd).members.size} member(s). The emoji binded to that role is "${(client.emojis.has(emojitoadd)) ? client.emojis.get(emojitoadd).toString() : emojitoadd}"`));
            client.reactsave.pushIn(guild.id, `template_${template}_emoji`, emojitoadd, true);
            client.reactsave.pushIn(guild.id, `template_${template}_role`, roletoadd, true);
            if (messages.length <= 99 && messages.length > 0) channel.bulkDelete(messages).catch((O_o) => O_o);
        });
    });

};