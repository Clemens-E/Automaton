module.exports.run = async (client, message) => {
    const channel = message.channel;
    const guild = await message.guild.fetchMembers();
    if (!channel.permissionsFor(guild.me).has('SEND_MESSAGES')) return message.author.send(`I can't send messages in ${channel}. Please make sure I can and try again.`);
    const msg = await channel.send(`${client.infos.loading} fetching members.`);

    const hoisted = guild.members.filter(m => m.displayName < '0');
    await msg.edit(`found ${hoisted.size} hoisted users.\nnow dehoisting ${client.infos.loading}`);
    let changed = 0;
    hoisted.forEach(element => {
        if (element.highestRole.position >= message.guild.me.highestRole.position) return;
        element.setNickname('no hoisting', `dehoisting runned by ${message.author.tag}`);
        changed++;
    });
    setTimeout(() => msg.edit(`changed ${changed} Nicknames of ${hoisted.size} hoisted users.`), 2000);
};

exports.help = {
    name: 'dehoist',
    category: 'moderation',
    example: 'dehoist',
    description: 'scans the whole server. Every User with a hoisted name gets renamed',
    userPermissions: ['MANAGE_NICKNAMES'],
    userChannelPermissions: [],
    myPermissions: ['MANAGE_NICKNAMES'],
    myChannelPermissions: ['SEND_MESSAGES'],
};