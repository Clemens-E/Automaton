module.exports.run = async (client, message, args) => {
    if (!/^\d+$/.test(args[0])) return message.reply('Thats not a Number');
    client.settings.setProp(message.guild.id, 'maxBuffer', args[0]);
    await message.channel.send(`Done! Your new maximal messages until mute is: ${args[0]}(default is 7)`);
};

exports.help = {
    name: 'maxbuffer',
    category: 'settings',
    example: 'maxbuffer 8',
    description: 'sets the maximal messages in the interval for antispam until mute/kick',
    userPermissions: ['MANAGE_GUILD'],
    userChannelPermissions: [],
    myPermissions: [],
    myChannelPermissions: ['SEND_MESSAGES'],
};