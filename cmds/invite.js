module.exports.run = async (client, message) => {
    client.generateInvite(8).then(l => message.channel.send(`<${l}>`));
};

exports.help = {
    name: 'invite',
    category: 'others',
    example: 'invite',
    description: 'Sends a Invite for the Bot',
    userPermissions: [],
    userChannelPermissions: [],
    myPermissions: [],
    myChannelPermissions: ['SEND_MESSAGES'],
};