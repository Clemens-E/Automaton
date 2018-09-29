const $console = require('Console');
module.exports.run = async (client, message) => {
    const guild = message.guild;
    const channel = message.channel;
    if (!channel.permissionsFor(guild.me).has('SEND_MESSAGES')) return message.author.send(`I can't send messages in ${channel}. Please make sure I can and try again.`);
    if (!client.reactsave.has(guild.id) || !client.settings.has(guild.id)) {
        message.author.send(':x: Something unexpected happened\nThe developer got a notification');
        channel.send(':x: Something unexpected happened\nThe developer got a notification');
        $console.stress('data for a server was not available');
        $console.error(`guild: ${guild.name}|${guild.id}\nreactsave: ${client.reactsave.has(guild.id)}\nsettings: ${client.settings.has(guild.id)}`);
        return;
    }
    const userperm = message.member.permissions;
    if (!userperm.has('MANAGE_GUILD')) return channel.send('You don\'t have enough permissions. You need\n`Manage Guild`\n');
    const messages = [];
    let rmHighlight;
    messages.push(message);
    messages.push(await channel.send('Please send the Word(s) that should be removed from the Highlight list. Type `//cancel` to cancel'));
    const filter = m =>
        m.author.id === message.author.id;
    const mcollector = channel.createMessageCollector(filter, {
        time: 300000,
    });
    // Let that run until a valid rolename
    mcollector.on('collect', async (m) => {
        messages.push(m);
        if (m.content === '//cancel') return mcollector.stop();
        if (!client.settings.getProp(guild.id, 'highlight_it').includes(m.content)) return messages.push(await channel.send('I can\'t find that string in my database'));
        rmHighlight = m.content;
        mcollector.stop();
    });

    mcollector.on('end', async () => {
        if (!rmHighlight) {
            if (messages.length <= 99 && messages.length > 0) channel.bulkDelete(messages).catch((O_o) => O_o);
            return channel.send('Time went out or the command was cancelled. Nothing removed');
        }
        if (messages.length <= 99 && messages.length > 0) channel.bulkDelete(messages).catch((O_o) => O_o);
        client.settings.removeFrom(guild.id, 'highlight_it', rmHighlight);
        channel.send(`removed the string\`\`\`${rmHighlight}\`\`\` from highlight.`);
    });

};


exports.help = {
    name: 'remove-highlight',
    category: 'highlight messages',
    example: 'remove-highlight',
    description: 'Calls a input for removing a word for message highlight',
};