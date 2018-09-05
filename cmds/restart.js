module.exports.run = async (client, message) => {
    if (message.author.id !== client.config.ownerid) return;
    await message.react('✅');
    process.exit(0);
};