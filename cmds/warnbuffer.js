module.exports.run = async (client, message, args) => {
    if (!/^\d+$/.test(args[0])) return message.reply('Thats not a Number');
    client.settings.setProp(message.guild.id, 'warnBuffer', args[0]);
    message.channel.send(`Done! Your new messages until warn is: ${args[0]} (default is 5)`);
};

exports.help = {
    name: 'warnbuffer',
    category: 'moderation',
    example: 'warnbuffer 5',
    description: 'Sets the maximal messages for antispam until warning',
    userPermissions: ['MANAGE_GUILD'],
    userChannelPermissions: [],
    myPermissions: [],
    myChannelPermissions: ['SEND_MESSAGES'],
};