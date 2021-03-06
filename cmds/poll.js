const Discord = require('discord.js');
module.exports.run = async (client, message, args) => {
    if (!message.channel.permissionsFor(message.guild.me).has('SEND_MESSAGES')) return message.author.send(`I can't send messages in ${message.channel}.`);
    let timeout;
    try { timeout = parseInt(args[0] * 1000); }
    catch (error) {
        return message.channel.send('Please send a valid number after the command for time');
    }
    args.shift();
    const content = args.join(' ');
    if (content.length > 255) return message.channel.send(`Please provide a topic with less than 255 characters (your message had ${message.content.length} characters)`);
    if (!timeout) return message.channel.send('Please send a valid number after the command for time');
    const msg = await message.channel.send(new Discord.RichEmbed()
        .setTitle(content)
        .setAuthor(message.author.username, message.author.avatarURL)
        .setFooter(`${timeout / 1000} Seconds time to react`)
        .setTimestamp()
        .setColor(client.infos.ci));
    await msg.react('👍');
    await msg.react('👎');
    const filter = (reaction, user) => (reaction.emoji.name === '👎' || reaction.emoji.name === '👍') && !user.bot;
    msg.awaitReactions(filter, { time: timeout }).then(c => {
        const down = c.find(r => r.emoji.name === '👎');
        const up = c.find(r => r.emoji.name === '👍');
        message.channel.send(new Discord.RichEmbed()
            .setTitle(content)
            .setAuthor(message.author.username, message.author.avatarURL)
            .addField('Upvotes:', (up) ? up.count - 1 : 0)
            .addField('Downvotes:', (down) ? down.count - 1 : 0)
            .setColor((down > up) ? client.infos.ce : client.infos.cs));
    });

};

exports.help = {
    name: 'poll',
    category: 'others',
    example: 'poll 100 is this bot good?',
    description: 'creates a poll message where users can vote.',
    userPermissions: [],
    userChannelPermissions: [],
    myPermissions: [],
    myChannelPermissions: ['SEND_MESSAGES', 'ADD_REACTIONS'],
};