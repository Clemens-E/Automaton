const Discord = require('discord.js');
module.exports.run = async (client, message, args) => {
    const member = message.mentions.members.first();
    if (!member) return message.channel.send('Please mention the member you want to warn');
    if (!args[1]) return message.channel.send('Please send in a reason behind the mention');
    if (member.highestRole.position >= message.member.highestRole.position) return message.channel.send('The mentioned members highest role position equals or exceeds yours.');

    args.shift();
    const guild = message.guild;
    const channel = message.channel;
    const reason = args.join(' ');
    const logchannel = client.getLogChannel(guild.id);


    if (!client.warns.has(guild.id)) client.warns.set(guild.id, {});
    if (client.warns.hasProp(guild.id, member.id)) client.warns.inc(guild.id, member.id);
    else client.warns.setProp(guild.id, member.id, 1);
    const warns = client.warns.getProp(guild.id, member.id);

    channel.send(new Discord.RichEmbed()
        .setColor(client.infos.cw)
        .addField('User warned', `${message.author} warned ${member} for \`${reason}\``)
        .setFooter(`this is ${member.user.tag}'s ${warns} warn.`));

    if (!member.user.bot) {
        member.send(new Discord.RichEmbed()
            .setColor(client.infos.cw)
            .addField(`You where warned on \`${guild.name}\``, `${message.author} warned you for \`${reason}\``)
            .setFooter(`this is your ${warns} warn.`));
    }

    if (!logchannel) return message.reply(` __Warning:__ You don't have a log channel!\nPlease use \`${client.settings.getProp(message.guild.id, 'prefix')}loghere\` in the new log channel.`);
    if (!logchannel.permissionsFor(message.guild.me).has('SEND_MESSAGES')) return message.reply(' __Warning:__ I don\'t have the permission to send messages in your log channel.');
    logchannel.send(new Discord.RichEmbed()
        .setColor(client.infos.cw)
        .addField('User warned', `${message.author} warned ${member} for \`${reason}\``)
        .setFooter(`this is ${member.user.tag}'s ${warns} warn.`));
};

exports.help = {
    name: 'warn',
    category: 'moderation',
    example: 'warn @Member',
    description: 'warns a Member',
    userPermissions: ['KICK_MEMBERS'],
    userChannelPermissions: [],
    myPermissions: [],
    myChannelPermissions: ['SEND_MESSAGES'],
};