const child = require('child_process');
module.exports.run = async (client, message) => {
    if (message.author.id !== client.config.ownerid) return;
    const msg = await message.channel.send('executing pull command...');
    child.exec('git pull origin master', async (err, stdout, stderr) => {
        if (err) throw err;
        if (stdout === 'Already up-to-date.') return await msg.edit(stdout);
        await msg.edit(stdout + '  Now restarting...');
        client.settings.set('lastMessage', { msg: msg.id, channel: msg.channel.id });
        process.exit(0);
    });
};


exports.help = {
    name: 'restart',
    category: 'owner commands',
    example: 'restart',
    description: 'Stops the process. Hopefully pm2 restarts it',
};