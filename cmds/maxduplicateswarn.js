module.exports.run = async (client, message, args) => {
    if (!/^\d+$/.test(args[0])) return message.reply('Thats not a Number');
    client.settings.setProp(message.guild.id, 'maxDuplicatesWarning', args[0]);
    message.channel.send(`Done! Your new maximal duplicates messages until warning is: ${args[0]}(default is 5)`);
};

exports.help = {
    name: 'maxduplicateswarn',
    category: 'settings',
    example: 'maxduplicateswarn 5',
    description: 'Sets the maximal dublicate messages for antispam until warning',
    userPermissions: ['MANAGE_GUILD'],
    userChannelPermissions: [],
    myPermissions: [],
    myChannelPermissions: ['SEND_MESSAGES'],
};