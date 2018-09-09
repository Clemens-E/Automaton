const Discord = require('discord.js');
module.exports.run = async (client, message) => {
    if (!message.channel.permissionsFor(message.guild.me).has('SEND_MESSAGES')) return;
    // broken yo
};