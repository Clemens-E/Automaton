/*
Contains Multiple extensions of used classes
like
- Discord.js
- Enmap
*/

const { Client } = require('discord.js');
class Automaton extends Client {
    getLogChannel(guildId) {
        if (typeof guildId !== 'string') throw 'Guild id must be a String.';
        const logchannel = this.channels.get(this.settings.getProp(guildId, 'log_channel'));
        if (logchannel && !logchannel.permissionsFor(this.user).has('SEND_MESSAGES')) return undefined;
        return logchannel;
    }
}

module.exports = Automaton;