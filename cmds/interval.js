const config = require('./../config.json');
module.exports.run = async (client, message, args) => {
  if (!message.member.hasPermission('MANAGE_GUILD') && message.author.id !== config.ownerID) return message.reply('You need the right to manage the server!');
  if (!/^\d+$/.test(args[0])) return message.reply('Thats not a Number');
  client.settings.setProp(message.guild.id, 'interval', args[0]);
  message.channel.send(`Done! Your New Interval time is: ${args[0]}ms (Standart is 1000)`);
};