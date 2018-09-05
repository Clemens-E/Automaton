module.exports.run = async (client, message, args) => {
    if (!message.channel.permissionsFor(message.guild.me).has('SEND_MESSAGES')) return message.author.send(`I can't send messages in ${message.channel}. Please make sure I can and try again.`);
    if ((!message.member.permissions.has('MANAGE_GUILD') || !message.member.permissions.has('MANAGE_ROLES')) && message.author.id !== client.config.ownerid) { return message.channel.send('You dont have enough permissions on that server\nYou need the permission `Manage Guild` and `Manage Roles`'); }
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