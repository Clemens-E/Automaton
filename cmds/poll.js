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
    if (content.length > 255) return message.channel.send(`Please provide a topic with less than 255 characters (your message had ${message.content.size} characters)`);
    if (!timeout) return message.channel.send('Please send a valid number after the command for time');
    const msg = await message.channel.send(new Discord.RichEmbed()
        .setTitle(args.join(' '))
        .setAuthor(message.author.username, message.author.avatarURL)
        .setFooter(`${timeout / 1000} Seconds time to react`)
        .setTimestamp());
    await msg.react('👎');
    await msg.react('👍');
    const filter = (reaction) => reaction.emoji.name === '👎' || reaction.emoji.name === '👍';
    msg.awaitReactions(filter, { time: timeout }).then(c => {
        const down = c.filter(r => r.emoji.name === '👎').size;
        const up = c.filter(r => r.emoji.name === '👍').size;
        message.channel.send(`Topic: ${content}\nUpvotes: ${up}\nDownvotes: ${down}`);
    });

};

exports.help = {
    name: 'poll',
    category: 'others',
    example: 'stealemote https://cdn.discordapp.com/emojis/498513312569360387.gif?v=1 wow',
    description: 'adds the linked emoji to the guild. add a name behind the url',
};