const Discord = require('discord.js');
const events = {
    MESSAGE_REACTION_ADD: 'messageReactionAdd',
    MESSAGE_REACTION_REMOVE: 'messageReactionRemove',
};
module.exports = async (client, event) => {
    if (event.t === 'MESSAGE_DELETE' && client.reactsave.has(event.d.guild_id)) {
        const dat = client.reactsave.get(event.d.guild_id);
        const arr = [dat.template_one_mids, dat.template_two_mids, dat.template_three_mids, dat.template_four_mids];
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].includes(event.d.id)) {
                const info = ['one', 'two', 'three', 'four'];
                client.reactsave.removeFrom(event.d.guild_id, `template_${info[i]}_mids`, event.d.id);
            }
        }
    }
    if (event.t === 'MESSAGE_DELETE_BULK' && client.reactsave.has(event.d.guild_id)) {
        const dat = client.reactsave.get(event.d.guild_id);
        const arr = [dat.template_one_mids, dat.template_two_mids, dat.template_three_mids, dat.template_four_mids];
        for (let index = 0; index < event.d.ids[index]; index++) {
            for (let i = 0; i < arr.length; i++) {
                if (arr[i].includes(event.d.ids[index])) {
                    const info = ['one', 'two', 'three', 'four'];
                    client.reactsave.removeFrom(event.d.guild_id, `template_${info[i]}_mids`, event.d.ids[index]);
                }
            }
        }
    }
    if (!events.hasOwnProperty(event.t)) return;

    const {
        d: data,
    } = event;
    const user = client.users.get(data.user_id);
    const channel = client.channels.get(data.channel_id) || await user.createDM();
    let message = channel.messages.get(data.message_id);

    const emojiKey = (data.emoji.id) ? `${data.emoji.name}:${data.emoji.id}` : data.emoji.name;

    if (event.t === 'MESSAGE_REACTION_REMOVE' && message && message.reactions.get(emojiKey) && message.reactions.get(emojiKey).users.size) return;
    if (event.t === 'MESSAGE_REACTION_ADD' && message) return;


    if (!message) {
        message = await channel.fetchMessage(data.message_id).catch((O_o) => O_o);
    }
    if (!message) return;
    if (!message.reactions) return;
    let reaction = message.reactions.get(emojiKey);

    if (!reaction) {
        const emoji = new Discord.Emoji(client.guilds.get(data.guild_id), data.emoji);
        reaction = new Discord.MessageReaction(message, emoji, 1, data.user_id === client.user.id);
    }
    client.emit(events[event.t], reaction, user);
};