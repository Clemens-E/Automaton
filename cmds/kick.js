const Discord = require('discord.js');
module.exports.run = async (client, message, args) => {
    const member = message.mentions.members.first();
    if (!message.member.hasPermission('KICK_MEMBERS')) return message.channel.send('You don\'t have enough permissions to kick members');
    if (!message.guild.me.permissions.has('KICK_MEMBERS')) return message.channel.send('I don\'t have enough permissions to kick members');
    if (!member) return message.channel.send('Please mention the member you want to kick');
    if (member.highestRole.position >= message.member.highestRole.position) return message.channel.send('The mentioned members highest role position equals or exceeds yours.');
    if (!member.kickable) return message.channel.send('I can\'t kick that member');
    if (member.highestRole.position >= message.guild.me.highestRole.position) return message.channel.send('The mentioned members highest role position equals or exceeds mine.');
    args.shift();
    const reason = args.join(' ');
    await member.kick(`${message.author} with reason: ${reason}`);

    message.channel.send(new Discord.RichEmbed()
        .setColor(3127860)
        .addField('User kicked', `:white_check_mark: ${member.user.tag} was kicked`));
    const logchannel = client.getLogchannel(message.guild.id);

    if (!logchannel) return message.reply(` __Warning:__ You don't have a log channel!\nPlease use \`${client.settings.getProp(message.guild.id, 'prefix')}loghere\` in the new log channel.`);
    if (!logchannel.permissionsFor(message.guild.me).has('SEND_MESSAGES')) return message.reply(' __Warning:__ I don\'t have the permission to send messages in your log channel.');
    logchannel.send(new Discord.RichEmbed()
        .setColor(3127860)
        .addField('User kicked', `${message.author} kicked ${member.user.tag} for \`${reason}\``));
};

exports.help = {
    name: 'kick',
    category: 'moderation',
    example: 'kick @User',
    description: 'Kicks the mentioned User. Duhhh',
};