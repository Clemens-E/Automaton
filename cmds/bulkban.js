const Discord = require('discord.js');
module.exports.run = async (client, message, args) => {
    if (!message.member.hasPermission('BAN_MEMBERS')) return message.channel.send('You don\'t have enough permissions to ban members');
    if (!message.guild.me.permissions.has('BAN_MEMBERS')) return message.channel.send('I don\'t have enough permissions to ban members');
    if (!args[0]) return message.channel.send('Please provide at least one user ID');
    const embed = new Discord.RichEmbed().setColor(client.config.cs).setTitle('Bulk Ban result');
    const guild = message.guild;
    let banned = '';
    Promise.all(args.map(u => {
        guild.ban(u).then((r) => {
            banned += `banned ${r.username}#${r.discriminator} (ID: ${r.id})\n`;
        }).catch((r) => {
            banned += `error while banning ID ${r}\n`;
        });
    })).then(() => {
        message.channel.send(embed.setDescription(banned));
    });
};