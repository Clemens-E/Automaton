module.exports.run = async (client, message, args) => {
    if (!/^\d+$/.test(args[0])) return message.reply('Thats not a Number');
    client.settings.setProp(message.guild.id, 'interval', args[0]);
    message.channel.send(`Done! Your New Interval time is: ${args[0]}ms (default is 5000)`);
};

exports.help = {
    name: 'interval',
    category: 'settings',
    example: 'interval 5000',
    description: 'Sets the interval for anti spam',
    userPermissions: ['MANAGE_GUILD'],
    userChannelPermissions: [],
    myPermissions: [],
    myChannelPermissions: ['SEND_MESSAGES'],
};