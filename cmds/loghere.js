const Discord = require('discord.js');
module.exports.run = async (client, message) => {
    if ((!message.member.permissions.has('MANAGE_GUILD')) && message.author.id !== client.config.ownerid) { return message.channel.send('You dont have enough permissions on that server\nYou need the permission `Manage Guild`'); }
    if (!message.channel.permissionsFor(message.guild.me).has('SEND_MESSAGES')) return message.author.send(':x:\nI cant send messages in that channel!\nPlease make sure I can and then try again');
    if (!client.settings.has(message.guild.id)) return message.author.send('I cant find any data from your server\nPlease join the support server or kick & add me again');

    // Set the channel
    await client.settings.setProp(message.guild.id, 'log_channel', message.channel.id);
    message.channel.send(new Discord.RichEmbed()
        .setColor(3127860)
        .setFooter('settings updated • log channel')
        .setDescription(`Your new log channel is <#${message.channel.id}>`)).then(() => {
            message.delete(3000);
        });
};

exports.help = {
    name: 'loghere',
    category: 'settings',
    example: 'loghere',
    description: 'Sets the current channel as log message channel',
};