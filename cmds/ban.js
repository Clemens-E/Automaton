const Discord = require('discord.js');
module.exports.run = async (client, message, args) => {
    const member = message.mentions.members.first();
    if (!member) return message.channel.send('Please mention the member you want to ban');
    if (member.highestRole.position >= message.member.highestRole.position) return message.channel.send('The mentioned members highest role position equals or exceeds yours.');
    if (!member.bannable) return message.channel.send('I can\'t ban that member');
    if (member.highestRole.position >= message.guild.me.highestRole.position) return message.channel.send('The mentioned members highest role position equals or exceeds mine.');
    args.shift();
    const reason = args.join(' ');

    await member.ban(`${message.author} with reason: ${reason}`);

    message.channel.send(new Discord.RichEmbed()
        .setColor(client.infos.cs)
        .addField('User banned', `:white_check_mark: ${member.user.tag} was banned`));
    const logchannel = client.getLogChannel(message.guild.id);

    if (!logchannel) return message.reply(` __Warning:__ You don't have a log channel!\nPlease use \`${client.settings.getProp(message.guild.id, 'prefix')}loghere\` in the new log channel.`);
    if (!logchannel.permissionsFor(message.guild.me).has('SEND_MESSAGES')) return message.reply(' __Warning:__ I don\'t have the permission to send messages in your log channel.');
    logchannel.send(new Discord.RichEmbed()
        .setColor(client.infos.cs)
        .addField('User banned', `${message.author} banned ${member.user.tag} for \`${reason}\``));
};

exports.help = {
    name: 'ban',
    category: 'moderation',
    example: 'ban @User <reason>',
    description: 'bans the User. Duhhh',
    userPermissions: ['BAN_MEMBERS'],
    userChannelPermissions: [],
    myPermissions: ['BAN_MEMBERS'],
    myChannelPermissions: ['SEND_MESSAGES'],
};