module.exports.run = async (client, message, args) => {
    if (!args[0]) return message.channel.send('Please give in a url. See help for a example');
    if (!args[1]) return message.channel.send('Please give in a name after the url. See help for a example');
    message.guild.createEmoji(args[0], args[1])
        .then(emoji => message.channel.send(`Done ${emoji}`))
        .catch(err => message.channel.send(err.message));
};

exports.help = {
    name: 'stealemote',
    category: 'others',
    example: 'stealemote https://cdn.discordapp.com/emojis/498513312569360387.gif?v=1 wow',
    description: 'adds the linked emoji to the guild. add a name behind the url',
    userPermissions: ['MANAGE_EMOJIS'],
    userChannelPermissions: [],
    myPermissions: [],
    myChannelPermissions: ['MANAGE_EMOJIS', 'USE_EXTERNAL_EMOJIS', 'SEND_MESSAGES'],
};