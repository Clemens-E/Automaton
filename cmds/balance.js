const Discord = require('discord.js');
module.exports.run = async (client, message) => {
    let points;
    await client.userp.fetch(message.author.id);
    if (client.userp.has(message.author.id)) points = client.userp.get(message.author.id, 'points');
    else points = 150;
    message.channel.send(new Discord.RichEmbed()
        .setColor(client.config.ci)
        .setTitle(`See ${message.author.tag}'s Bank balance`)
        .addField('**-------------------**', '** **')
        .addField(`current points: ${points}`, '** **')
        .addField('**-------------------**', '** **'));
};