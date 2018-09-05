const Discord = require('discord.js');
module.exports.run = async (client, message, args) => {
    if (!message.channel.permissionsFor(message.guild.me).has('SEND_MESSAGES')) return message.author.send(`I can't send messages in ${message.channel}. Please try another channel or ask the Admin`);
    if (!args[0]) return message.channel.send('Please give in a name.\nexample:`game Overwatch`');
    const game = args.join(' ');
    const members = message.guild.members.filter(p => (p.user.presence.game != null && p.user.presence.game.name.includes(game)));
    let allmember = '';
    let full = false;
    members.forEach(m => {
        if (allmember.length < 1500) {
            allmember += m.toString();
        }
 else if (!full) {
            full = true;
            allmember += '\n and more';
        }
    });
    message.channel.send(
        new Discord.RichEmbed()
            .setColor(40863)
            .setTitle(`Users playing games with names including "${game}":`)
            .setDescription(`${(members.size == 0) ? 'No User plays that game.' : `${allmember}`}`));

};