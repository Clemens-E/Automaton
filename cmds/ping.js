module.exports.run = async (client, message) => {
    message.channel.send(`${client.config.loading} Pinging`).then(sent => {
        sent.edit(`Pong! Took ${sent.createdTimestamp - message.createdTimestamp}ms`);
    });
};

exports.help = {
    name: 'ping',
    category: 'others',
    example: 'ping',
    description: 'shows the ping',
};