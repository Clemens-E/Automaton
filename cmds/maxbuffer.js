module.exports.run = async (client, message, args) => {
    if (!message.member.hasPermission('MANAGE_GUILD') && message.author.id !== client.config.ownerID) return message.reply('You need the right to manage the server!');
    if (!/^\d+$/.test(args[0])) return message.reply('Thats not a Number');
    client.settings.setProp(message.guild.id, 'maxBuffer', args[0]);
    await message.channel.send(`Done! Your new maximal messages until mute is: ${args[0]}(Standart is 5)`);
};