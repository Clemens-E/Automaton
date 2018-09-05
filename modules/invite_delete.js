const Discord = require('discord.js');
module.exports.run = async (client, message) => {
    if (message.member.highestRole.comparePositionTo(message.guild.me.highestRole) >= 0) return;
    const re = new RegExp('(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li)|discordapp\.com\/invite)\/.+[a-z]');
    if (!re.test(message.content)) { return; }
    if (!message.channel.permissionsFor(message.guild.me).has('MANAGE_MESSAGES')) return;

    await message.delete();
    const logchannel = client.settings.getProp(message.guild.id, 'log_channel');
    if (!client.channels.has(logchannel)) return;
    if (!client.channels.get(logchannel).permissionsFor(message.guild.me).has('SEND_MESSAGES')) return;
    client.channels.get(logchannel).send(new Discord.RichEmbed()
        .setColor(client.config.cw)
        .setFooter(`Automod ֍ message ID: ${message.id}`)
        .setDescription(`message of ${message.author} in ${message.channel} was deleted because it contained a invite link`));

};