module.exports.run = async (client, message) => {
    const channel = message.channel;
    const msg = await channel.send(`${client.config.loading} fetching members.`);
    const guild = await message.guild.fetchMembers();
    if (!channel.permissionsFor(guild.me).has('SEND_MESSAGES')) return message.author.send(`I can't send messages in ${channel}. Please make sure I can and try again.`);
    if (!message.member.hasPermission('MANAGE_NICKNAMES') && message.author.id !== client.config.ownerid) return message.reply('You need the permission `Manage Nicknames`');
    if (!message.guild.me.hasPermission('MANAGE_NICKNAMES')) return message.reply('I need the permission `Manage Nicknames`');
    const hoisted = guild.members.filter(m => !new RegExp(/^([a-z]|[0-9])/, 'i').test(m.displayName));
    await msg.edit(`found ${hoisted.size} hoisted users.\nnow dehoisting ${client.config.loading}`);
    let changed = 0;
    hoisted.forEach(element => {
        if (element.highestRole.position >= message.guild.me.highestRole.position) return;
        element.setNickname('no hoisting', `dehoisting runned by ${message.author.tag}`);
        changed++;
    });
    setTimeout(msg.edit(`changed ${changed} Nicknames of ${hoisted.size} hoisted users.`), 2000);
};

exports.help = {
    name: 'dehoist',
    category: 'moderation',
    example: 'dehoist',
    description: 'scans the whole server. Every User with a hoisted name gets renamed',
};