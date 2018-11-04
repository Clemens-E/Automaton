module.exports.run = async (client, message, args) => {
    if (!/^\d+$/.test(args[0])) return message.reply('Thats not a Number');
    client.settings.setProp(message.guild.id, 'maxDuplicatesBan', args[0]);
    message.channel.send(`Done! Your new maximal duplicates messages until mute is: ${args[0]}(default is 7)`);
};

exports.help = {
    name: 'maxduplicatesmute',
    category: 'settings',
    example: 'maxduplicateswarn 8',
    description: 'Sets the maximal dublicate messages for antispam until mute/kick',
    userPermissions: ['MANAGE_GUILD'],
    userChannelPermissions: [],
    myPermissions: [],
    myChannelPermissions: ['SEND_MESSAGES'],
};