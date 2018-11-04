const $console = require('Console');
module.exports.run = async (client, message) => {
    const guild = message.guild;
    const channel = message.channel;
    if (!client.reactsave.has(guild.id) || !client.settings.has(guild.id)) {
        message.author.send(':x: Something unexpected happened\nThe developer got a notification');
        channel.send(':x: Something unexpected happened\nThe developer got a notification');
        $console.stress('data for a server was not available');
        $console.error(`guild: ${guild.name}|${guild.id}\nreactsave: ${client.reactsave.has(guild.id)}\nsettings: ${client.settings.has(guild.id)}`);
        return;
    }
    const messages = [];
    let add_highlight;
    messages.push(message);
    messages.push(await channel.send('Please send the Word(s) that should be highlighted. Type `//cancel` to cancel'));
    const filter = m =>
        m.author.id === message.author.id;
    const mcollector = channel.createMessageCollector(filter, {
        time: 300000,
    });
    // Let that run until a valid rolename
    mcollector.on('collect', async (m) => {
        messages.push(m);
        if (m.content === '//cancel') return mcollector.stop();
        add_highlight = m.content;
        mcollector.stop();
    });

    mcollector.on('end', async () => {
        if (!add_highlight) {
            if (messages.length <= 99 && messages.length > 0) channel.bulkDelete(messages).catch((O_o) => O_o);
            return channel.send('Time went out or the command was cancelled. No Sentence added');
        }
        if (messages.length <= 99 && messages.length > 0) channel.bulkDelete(messages).catch((O_o) => O_o);
        client.settings.pushIn(guild.id, 'highlight_it', add_highlight);
        channel.send(`added the string\`\`\`${add_highlight}\`\`\` to highlight. You will recieve a message in your log channel.`);
    });
};

exports.help = {
    name: 'add-highlight',
    category: 'highlight messages',
    example: 'add-highlight',
    description: 'Calls a input for adding a word for message highlight',
    userPermissions: ['MANAGE_GUILD'],
    userChannelPermissions: [],
    myPermissions: [],
    myChannelPermissions: ['SEND_MESSAGES'],
};