const Discord = require('discord.js');
module.exports.run = async (client, message, args) => {
    const member = message.mentions.members.first() || message.guild.members.find(m => m.user.tag.toLowerCase().includes(args.join(' ').toLowerCase())) ||
        message.guild.members.find(m => m.displayName.toLowerCase().includes(args.join(' ').toLowerCase()));
    if (!member) return message.channel.send(`I can't find a member named \`${args.join('')}\``);
    const embed = new Discord.RichEmbed()
        .setTitle(member.user.username + '\' avatar')
        .setImage(member.user.displayAvatarURL)
        .setColor(client.infos.ci);
    message.channel.send({
        embed,
    });
};

exports.help = {
    name: 'avatar',
    category: 'others',
    example: 'avatar Auto',
    description: 'Showing the avatar of the mentioned user or seaches him by name/nickname',
    userPermissions: [],
    userChannelPermissions: [],
    myPermissions: [],
    myChannelPermissions: ['SEND_MESSAGES'],
};