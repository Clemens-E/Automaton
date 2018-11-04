module.exports.run = async (client, message, args) => {
    if (!args[0]) args[0] = 'none';
    switch (args[0].toLowerCase()) {
        case 'normal':
            client.settings.delete(message.guild.id);
            message.channel.send(`Done. ${args[0]} is deleted`);
            break;
        case 'reactions':
            client.reactsave.delete(message.guild.id);
            message.channel.send(`Done. ${args[0]} is deleted`);
            break;
        default:
            message.channel.send('I only have `reactions` and `normal`');
            break;
    }
};

exports.help = {
    name: 'reset',
    category: 'settings',
    example: 'reset',
    description: 'deleting a database for this Guild',
    userPermissions: ['MANAGE_ROLES', 'MANAGE_ROLES'],
    userChannelPermissions: [],
    myPermissions: [],
    myChannelPermissions: ['SEND_MESSAGES'],
};