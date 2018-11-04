const Discord = require('discord.js');
module.exports.run = async (client, message, args) => {
    const ftoMute = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[1]);
    if (!ftoMute) return message.channel.send('You didnt mention!');
    if (ftoMute.id === message.author.id) return message.channel.send('Please dont mute yourself');
    if (ftoMute.highestRole.position >= message.member.highestRole.position) return message.channel.send('You cannot mute a member, that is stronger than you!');
    const usertomute = message.guild.member(message.mentions.users.first());
    if (!usertomute) return;
    const guildid = message.guild.id;
    let timeinms = 0;
    if (args[1] == 'h') { timeinms = args[2] * 3600000; }
    else if (args[1] == 'm') { timeinms = args[2] * 60000; }
    else { return message.reply('Please use \'h\' or \'m\'\nExample: `tmpmute @Someone m 10`'); }
    timeinms += (new Date()).getTime();
    const set = {
        users_tempmute: 0,
        users_muted_ids: [],
    };
    if (!client.settings.has('mutes')) client.settings.set('mutes', set);
    const times = client.settings.getProp('mutes', 'users_tempmute');
    const array = client.settings.getProp('mutes', 'users_muted_ids');
    array.push(usertomute.user.id);
    array.push(String(timeinms));
    array.push(guildid);
    client.settings.setProp('mutes', 'users_muted_ids', array);
    client.settings.setProp('mutes', 'users_tempmute', times + 1);
    let fmuterole = message.guild.roles.find(r => r.name === 'muted by Automaton');
    if (!fmuterole) {
        fmuterole = await message.guild.createRole({
            name: 'muted by Automaton',
            color: '#000000',
            permissions: [],
        });
    }
    if (!message.guild.me.permissions.has('MANAGE_CHANNELS')) return message.channel.send('I need the permission `Manage Channels`');
    const channelsWithMissingPermissions = message.guild.channels.filter(c => c.type === 'text').filter(c => !c.permissionsFor(message.guild.me).has('MANAGE_ROLES'));
    if (channelsWithMissingPermissions.size > 0) {
        message.channel.send(`I can't mute the memeber in:\n${channelsWithMissingPermissions.map(c => '\n' + c.toString())}\nIam missing the \`manage permissions\` permission in them`);
    }
    message.guild.channels.map(async channel => {
        await channel.overwritePermissions(fmuterole, {
            SEND_MESSAGES: false,
            ADD_REACTIONS: false,
        }).catch((O_o) => O_o);
    });
    if (usertomute.roles.has(fmuterole.id)) return message.channel.send('User is already muted.');
    await usertomute.addRole(fmuterole);
    message.channel.send(new Discord.RichEmbed()
        .setColor(client.infos.cs)
        .addField('User Muted', `:white_check_mark: ${usertomute} is muted ${Math.round((timeinms - (new Date()).getTime()) / 60000)}m long`));
    const logchannel = client.settings.getProp(message.guild.id, 'log_channel');

    if (!client.channels.has(logchannel)) return message.reply(` __Warning: __ You don't have a log channel!\nPlease use \`${client.settings.getProp(message.guild.id, 'prefix')}loghere\` in the new log channel.`);
    if (!client.channels.get(logchannel).permissionsFor(message.guild.me).has('SEND_MESSAGES')) return message.reply(' __Warning:__ I don\'t have the permission to send messages in your log channel.');
    client.channels.get(logchannel).send(new Discord.RichEmbed()
        .setColor(client.infos.cs)
        .addField('User Muted', `:mute: ${message.author} muted ${usertomute} for ${Math.round((timeinms - (new Date()).getTime()) / 60000)} minutes`));

};

exports.help = {
    name: 'tmpmute',
    category: 'moderation',
    example: 'tmpmute @User m 10',
    description: 'Mutes a User for a given time',
    userPermissions: ['MANAGE_MESSAGES'],
    userChannelPermissions: [],
    myPermissions: [],
    myChannelPermissions: ['MANAGE_ROLES', 'SEND_MESSAGES'],
};