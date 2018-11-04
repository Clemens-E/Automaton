module.exports.run = async (client, message) => {
    if (message.author.id !== client.config.ownerid) return;
    await message.react('✅');
    process.exit(0);
};


exports.help = {
    name: 'restart',
    category: 'owner commands',
    example: 'restart',
    description: 'Stops the process. Hopefully pm2 restarts it',
    userPermissions: [],
    userChannelPermissions: [],
    myPermissions: [],
    myChannelPermissions: [],
};