const Discord = require('discord.js');
module.exports.run = async (client, message, args) => {
    if (!message.channel.permissionsFor(message.guild.me).has('SEND_MESSAGES')) return message.author.send(`I can't send messages in ${message.channel}.`);
    let member = message.mentions.members.first() || message.guild.members.find(m => m.user.tag.toLowerCase().includes(args.join(' ').toLowerCase())) ||
        message.guild.members.find(m => m.displayName.toLowerCase().includes(args.join(' ').toLowerCase()));
    if (!args[0]) member = message.member;
    if (!member) message.channel.send(`I can't find a member named ${args.join('')}`);
    const embed = new Discord.RichEmbed()
        .setTitle(member.user.username + '\' avatar')
        .setImage(member.user.avatarURL)
        .setColor(client.infos.ci);
    message.channel.send({
        embed,
    });
};

exports.help = {
    name: 'avatar',
    category: 'others',
    example: 'avatar Auto',
    description: 'Showing the avatar of the mentioned user or seaches him by name',
};