const Discord = require('discord.js');
const { SlotMachine, SlotSymbol } = require('slot-machine');
module.exports.run = async (client, message, args) => {
    if (!args[0] || args[0].match(/\d+\W/)) return message.channel.send('Please give in a bet amount');
    const bet = parseFloat(args[0]);
    await client.userp.fetch(message.author.id);
    if (!client.userp.has(message.author.id)) client.userp.set(message.author.id, { 'points': 150 });
    message.channel.send('Its the well loved Soon™');

// Its the well loved Soon™
};