const $console = require('Console');
module.exports.run = async (client, message) => {
    if (!client.reactsave.has(message.guild.id) || !client.settings.has(message.guild.id)) {
        message.author.send(':x: Something unexpected happened\nThe developer got a notification');
        message.channel.send(':x: Something unexpected happened\nThe developer got a notification');
        $console.stress('data for a server was not available');
        $console.error(`message.guild: ${message.guild.name}|${message.guild.id}\nreactsave: ${client.reactsave.has(message.guild.id)}\nsettings: ${client.settings.has(message.guild.id)}`);
        return;
    }
    if (!client.premium.has(message.author.id)) return message.reply('You are not listed in the Premium Database. Contact CHY4E#0505 if you think you should be');
    if (!message.member.permissions.has('ADMINISTRATOR')) return message.reply('You need to be Administrator on thisguild.\n(so you can\' give every guild premium');
    client.settings.setProp(message.guild.id, 'premium', true);
    message.channel.send(`The guild \`${message.guild.name}\` is now Premium`);
};

exports.help = {
    name: 'get-premium',
    category: 'premium',
    example: 'get-premium',
    description: 'makes the current Guild premium. Only works with Users listed in the Premium Database',
    userPermissions: [],
    userChannelPermissions: [],
    myPermissions: [],
    myChannelPermissions: ['SEND_MESSAGES'],
};