module.exports.run = async (client, message, args) => {
    const mtoMute = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[1]);
    if (!mtoMute) return message.channel.send('You didnt mention!');
    if (mtoMute.highestRole.position >= message.member.highestRole.position) return message.channel.send('You cannot unmute a member, that is stronger than you!');
    const usertomute = message.guild.member(message.mentions.users.first());
    if (!usertomute) return;
    const role = message.guild.roles.find(r => r.name === 'muted by Automaton');
    const data = client.settings.get('mutes');
    const index = data.users_muted_ids.indexOf(mtoMute.id);
    if (index === -1) return message.channel.send('This member is not muted.');
    data.users_muted_ids.splice(index, 3);
    data.users_tempmute--;
    client.settings.set('mutes', data);
    mtoMute.removeRole(role).then(() => message.channel.send(`Unmuted ${mtoMute.user.tag}`));
};

exports.help = {
    name: 'unmute',
    category: 'moderation',
    example: 'unmute @User',
    description: 'removing tmp mute from a member',
    userPermissions: ['MANAGE_MESSAGES'],
    userChannelPermissions: [],
    myPermissions: [],
    myChannelPermissions: ['MANAGE_ROLES', 'SEND_MESSAGES'],
};