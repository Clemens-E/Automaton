const Discord = require('discord.js');
module.exports = async (client, channel) => {

    const db = client.settings.get(channel.guild.id);
    if (!db) return;
    const logchannel = client.channels.get(client.config.detailed_logs_channel);
    if (db.log_channel === channel.id) {
        client.settings.setProp(channel.guild.id, 'log_channel', '');
        logchannel.send(new Discord.RichEmbed().setDescription('log channel was deleted.\n Deleted entry out of Database').setTitle(channel.guild.name).setColor(client.config.cw).setTimestamp());
    }
    if (db.greet_channel === channel.id) {
        client.settings.setProp(channel.guild.id, 'greet_channel', '');
        logchannel.send(new Discord.RichEmbed().setDescription('greet channel was deleted.\n Deleted entry out of Database').setTitle(channel.guild.name).setColor(client.config.cw).setTimestamp());
    }
};