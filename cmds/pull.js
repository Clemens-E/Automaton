const { exec } = require('child_process');
module.exports.run = async (client, message) => {
    if (message.author.id !== client.config.ownerid) return;
    const msg = await message.channel.send('executing pull command...');
    exec('git pull origin master', async (err, stdout, stderr) => {
        if (err) throw err;
        if (stdout === 'Already up-to-date.\n') return msg.edit(stdout);
        await msg.edit(`\`\`\`fix${stdout}\`\`\`Now restarting...`);
        client.settings.set('lastMessage', { msg: msg.id, channel: msg.channel.id, content: stdout });
        process.exit(0);
    });
};


exports.help = {
    name: 'restart',
    category: 'owner commands',
    example: 'restart',
    description: 'Stops the process. Hopefully pm2 restarts it',
};