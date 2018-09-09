const Discord = require('discord.js');
module.exports.run = async (client, message, args) => {
    message.channel.send(new Discord.RichEmbed().setDescription(`[Click me!](https://lmgtfy.com/?q=${args.join('+')} 'How to do it')`).setColor(client.config.ci));
};