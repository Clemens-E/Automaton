module.exports.run = async (client, message) => {
    message.channel.send('Pinging...').then(sent => {
        sent.edit(`Pong! Took ${sent.createdTimestamp - message.createdTimestamp}ms`);
    });
};