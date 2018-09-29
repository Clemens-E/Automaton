const Discord = require('discord.js');
module.exports.run = async (client, message, args) => {
    let prefix = client.settings.getProp(message.guild.id, 'prefix');
    if (!message.member.hasPermission('MANAGE_GUILD') && message.author.id !== client.config.ownerID) return message.reply('You need the permission `Manage Guild`');
    if (!args[0]) return message.reply('That prefix is empty!\nexample of command:\n`' + prefix + 'prefix $` //New prefix is \'$\'');
    prefix = args.join(' ');
    if (prefix.length > 10) return message.channel.send('That prefix is too big. Please use a prexif under 10 symbols');
    client.settings.setProp(message.guild.id, 'prefix', prefix);
    message.channel.send(`New Prefix is: \`${client.settings.getProp(message.guild.id, 'prefix')}\``);

    const logchannel = client.settings.getProp(message.guild.id, 'log_channel');
    if (!client.channels.has(logchannel)) return message.reply(` __Warning:__ You don't have a log channel!\nPlease use \`${client.settings.getProp(message.guild.id, 'prefix')}loghere\` in the new log channel.`);
    if (!client.channels.get(logchannel).permissionsFor(message.guild.me).has('SEND_MESSAGES')) return message.reply(' __Warning:__ I don\'t have the permission to write messages in your log channel.');
    client.channels.get(logchannel).send(new Discord.RichEmbed()
        .setColor(3127860)
        .setFooter(`settings updated (by ${message.author.tag}) • new prefix`)
        .setDescription(`new prefix: \`${client.settings.getProp(message.guild.id, 'prefix')}\``));

};

exports.help = {
    name: 'prefix',
    category: 'settings',
    example: 'prefix !',
    description: 'Sets the prefix for this server',
};