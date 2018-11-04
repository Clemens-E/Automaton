const Discord = require('discord.js');
module.exports.run = async (client, message) => {
    if (!client.settings.has(message.guild.id)) return message.author.send('I can\'t find any data from your server\nPlease join the support server or kick & add me again');

    // Set the channel
    client.settings.setProp(message.guild.id, 'greet_channel', message.channel.id);
    message.channel.send(new Discord.RichEmbed()
        .setColor(3127860)
        .setFooter('settings updated • greet channel')
        .setDescription(`Your new greet channel is <#${message.channel.id}>`)).then(msg => {
            if (message.channel.permissionsFor(message.guild.me).has('MANAGE_MESSAGES')) message.delete(3000);
            msg.delete(5000);
        });
    const logchannel = client.settings.getProp(message.guild.id, 'log_channel');

    if (!client.channels.has(logchannel)) return message.reply(` __Warning:__ You don't have a log channel!\nPlease use \`${client.settings.getProp(message.guild.id, 'prefix')}loghere\` in the new log channel.`);
    if (!client.channels.get(logchannel).permissionsFor(message.guild.me).has('SEND_MESSAGES')) return message.reply(' __Warning:__ I don\'t have the permission to write messages in your log channel.');
    client.channels.get(logchannel).send(new Discord.RichEmbed()
        .setColor(3127860)
        .setFooter(`settings updated (by ${message.author.tag}) • greet channel `)
        .setDescription(`Your new greet channel is <#${message.channel.id}>`));

};

exports.help = {
    name: 'greethere',
    category: 'settings',
    example: 'greethere',
    description: 'sets the current channel as welcome message channel',
    userPermissions: ['MANAGE_GUILD'],
    userChannelPermissions: [],
    myPermissions: [],
    myChannelPermissions: ['SEND_MESSAGES'],
};