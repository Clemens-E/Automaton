const $console = require('Console');
module.exports.run = async (client, message, args) => {
    const guild = message.guild;
    const channel = message.channel;
    if (!client.reactsave.has(guild.id) || !client.settings.has(guild.id)) {
        message.author.send(':x: Something unexpected happened\nThe developer got a notification');
        channel.send(':x: Something unexpected happened\nThe developer got a notification');
        $console.stress('data for a server was not available');
        $console.error(`guild: ${guild.name}|${guild.id}\nreactsave: ${client.reactsave.has(guild.id)}\nsettings: ${client.settings.has(guild.id)}`);
        return;
    }
    const template = (!args[0]) ? '' : args[0].toLowerCase();
    const premium = client.settings.getProp(guild.id, 'premium');
    let mtoadd;
    const messages = [];
    switch (template) {
        case 'one':
        case 'two':
            break;
        case 'three':
        case 'four':
            if (!premium) return channel.send('Sorry, you need premium to have more than 2 templates');
            break;
        default:
            return channel.send('I don\'t have that template.\nOnly `one`, `two`. (only premium):`three` and `four` ');
    }
    messages.push(message);
    messages.push(await channel.send('Your next message in this channel will be the message where people can react to.'));
    const filter = m => m.author.id === message.author.id;
    const mcollector = channel.createMessageCollector(filter, {
        time: 600000,
    });
    mcollector.on('collect', async (m) => {
        if (m.content !== '//cancel') mtoadd = m;
        mcollector.stop();
    });
    mcollector.on('end', async () => {
        if (!mtoadd) {
            if (messages.length <= 99 && messages.length > 0) channel.bulkDelete(messages).catch(O_o => O_o);
            return channel.send('cancelled. no message added');
        }
        client.reactsave.pushIn(guild.id, `template_${template}_mids`, mtoadd.id);
        messages.push(await channel.send(`Done. The last message of ${mtoadd.author.tag} was added. I will react with every possible emoji if I can. Message size: ${mtoadd.content.length}.\n(this message will delete itself)`));
        messages.push(await channel.send(`Notice: Every action on template ${template} will also changes what happens when reacting`));
        for (let i = 0; i < client.reactsave.getProp(guild.id, `template_${template}_emoji`).length; i++) {
            const emoji = client.emojis.get(client.reactsave.getProp(guild.id, `template_${template}_emoji`)[i]) ||
                client.reactsave.getProp(guild.id, `template_${template}_emoji`)[i];
            $console.log(emoji);
            await mtoadd.react(emoji);
        }
        setTimeout(() => {
            if (messages.length <= 99 && messages.length > 0) channel.bulkDelete(messages).catch(O_o => O_o);
        }, 10000);
    });

};


exports.help = {
    name: 'reacthere',
    category: 'reaction role',
    example: 'reacthere',
    description: 'Calls a input for adding a message for reaction role',
    userPermissions: ['MANAGE_ROLES'],
    userChannelPermissions: [],
    myPermissions: [],
    myChannelPermissions: ['SEND_MESSAGES', 'ADD_REACTIONS'],
};