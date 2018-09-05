module.exports = async (client, reaction, user) => {
    if (!client.reactsave.has(reaction.message.guild.id)) return;
    const data = client.reactsave.get(reaction.message.guild.id);
    const options = ['one', 'two', 'three', 'four'];
    for (let i = 0; i < options.length; i++) {
        if (data[`template_${options[i]}_mids`].includes(reaction.message.id) && data[`template_${options[i]}_emoji`].includes(reaction.emoji.id || reaction.emoji.name)) {
            client.emit('reactionAddWithRole', reaction, user, i);
        }
    }
};