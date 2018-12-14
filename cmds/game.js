const Discord = require('discord.js');
module.exports.run = async (client, message, args) => {
    if (!args[0]) return message.channel.send('Please give in a name.\nexample:`game Overwatch`');
    const game = args.join(' ');
    const members = message.guild.members.filter(p => (p.user.presence.game != null && p.user.presence.game.name.includes(game)));
    let allmember = '';
    let full = false;
    members.forEach(m => {
        if (allmember.length < 1500) {
            allmember += m.toString() + '\n';
        } else if (!full) {
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

exports.help = {
    name: 'game',
    category: 'others',
    example: 'game Honor',
    description: 'searches for users that play that game',
    userPermissions: [],
    userChannelPermissions: [],
    myPermissions: [],
    myChannelPermissions: ['SEND_MESSAGES'],
};