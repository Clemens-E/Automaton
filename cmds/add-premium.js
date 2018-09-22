const $console = require('Console');
module.exports.run = async (client, message, args) => {
    if (!args[0]) return message.reply('provide a user ID');
    if (message.author.id !== client.config.ownerid) return message.reply('No permission to run this command.');
    const user = await client.fetchUser(args[0]).catch((O_o) => O_o);
    if (!user.id) return message.reply(`can't find a user with the ID \`${args[0]}\``);
    $console.log(`${message.author.tag} gave ${user.tag} premium.`);
    client.premium.set(user.id);
    await message.react('✔');
};