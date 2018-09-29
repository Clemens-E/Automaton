module.exports.run = async (client, message) => {
    const user = message.mentions.users.first();
    const amount = parseInt(message.content.split(' ')[1]) ? parseInt(message.content.split(' ')[1]) : parseInt(message.content.split(' ')[2]);
    if (!message.channel.permissionsFor(message.guild.me).has('MANAGE_MESSAGES')) return message.reply('I don\'t have enough permissions.');
    if (!amount) return message.reply('Must specify an amount to delete!');
    if (amount > 100) return message.reply('Must specify an amount below 100');
    if (!amount && !user) return message.reply('Must specify a user and amount, or just an amount, of messages to purge!');
    message.channel.fetchMessages({
        limit: amount,
    }).then((messages) => {
        if (user) {
            const filterBy = user ? user.id : client.user.id;
            messages = messages.filter(m => m.author.id === filterBy).array().slice(0, amount);
        }
        message.channel.bulkDelete(messages).catch(error => console.log(error.stack));
    });

};

exports.help = {
    name: 'rm',
    category: 'moderation',
    example: 'rm [number] <tag>',
    description: 'deletes the amount of messages in the channel. Tag a User to only delete his messages',
};