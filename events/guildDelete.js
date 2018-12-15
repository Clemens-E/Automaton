const $console = require('Console');
const Discord = require('discord.js');
module.exports = async (client, guild) => {
    if (client.leavedMyself) return client.leavedMyself = false;
    $console.error(`left a guild | ${guild.name} | ${guild.memberCount}`);
    client.channels.get('461211772804792320').send(new Discord.RichEmbed()
        .setColor(16711680)
        .addField('*Left a Guild*', `The Traitor: "${guild.name}"`)
        .addField('ID', guild.id, true)
        .addField('Name', guild.name, true)
        .addField('Owner', guild.owner.user.tag, true)
        .addField('Region', guild.region, true)
        .addField('Channels', guild.channels.size, true)
        .addField('Members', guild.memberCount, true)
        .addField('Humans', guild.memberCount - guild.members.filter(m => m.user.bot).size, true)
        .addField('Bots', guild.members.filter(m => m.user.bot).size, true));
    client.settings.delete(guild.id);
    client.reactsave.delete(guild.id);
    client.warns.delete(guild.id);
};