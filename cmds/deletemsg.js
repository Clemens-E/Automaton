const $console = require('Console');
module.exports.run = async (client, message, args) => {
    if (!client.reactsave.has(message.guild.id)) {
        $console.stress(`Database for ${message.guild.id}`);
        return message.channel.send('Mistake with the Database! developer will get a notification.');
    }
    const guild = message.guild;
    const channel = message.channel;
    if (!args[0]) return channel.send(`You need to give me a message ID you want to delete from the reaction setting. Do \`${client.settings.getProp(guild.id, 'prefix')}settings reactions\``);
    let msgfound = false;
    const dat = client.reactsave.get(guild.id);
    const info = ['one', 'two', 'three', 'four'];
    for (let i = 0; i < info.length; i++) {
        if (dat[`template_${info[0]}_mids`].includes(args[0])) {
            msgfound = true;
            client.reactsave.removeFrom(guild.id, `template_${info[i]}_mids`, args[0]);
        }
    }
    if (!msgfound) return channel.send('I can\'t find that message id in my database.');
    channel.send('I found the message ID. I removed it, and new reactions won\'t get a role.');
};