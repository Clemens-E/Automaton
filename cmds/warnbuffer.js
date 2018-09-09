module.exports.run = async (client, message, args) => {
    if (!message.member.hasPermission('MANAGE_GUILD') && message.author.id !== client.config.ownerID) return message.reply('You need the right to manage the server!');
    if (!/^\d+$/.test(args[0])) return message.reply('Thats not a Number');
    client.settings.setProp(message.guild.id, 'warnBuffer', args[0]);
    message.channel.send(`Done! Your new messages until warn is: ${args[0]} (Standart is 5)`);
};