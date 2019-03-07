module.exports.run = async (client, message) => {
    const guild = message.guild;
    const channel = message.channel;
    if (!client.warns.has(guild.id)) return channel.send('Nobody was ever warned on this Server.');
    const user = message.mentions.users.first();
    if (!user) return channel.send('You have to mention somebody.');
    if (!client.warns.has(guild.id, user.id) || client.warns.get(guild.id, user.id) <= 0) return channel.send('This user was never warned.');
    client.warns.dec(guild.id, user.id);
    channel.send(`${user.tag} was warned ${client.warns.get(guild.id, user.id) + 1} times.\nNow he was warned ${client.warns.get(guild.id, user.id)} times.`);
};
exports.help = {
    name: 'removewarn',
    category: 'moderation',
    example: 'removewarn @user',
    description: 'Removing a warn from a user',
    userPermissions: ['KICK_MEMBERS'],
    userChannelPermissions: [],
    myPermissions: [],
    myChannelPermissions: ['SEND_MESSAGES'],
};