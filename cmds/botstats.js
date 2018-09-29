const {
    version,
} = require('discord.js');
const moment = require('moment');
require('moment-duration-format');
const os = require('os');
const cpuStat = require('cpu-stat');
const Discord = require('discord.js');
module.exports.run = async (client, message) => {
    cpuStat.usagePercent(function (err, percent) {
        if (err) {
            return;
        }
        const duration = moment.duration(client.uptime).format(' D [days], H [hrs], m [mins], s [secs]');
        message.channel.send(new Discord.RichEmbed()
            .setTitle('*** Stats ***')
            .setColor(client.config.cn)
            .addField('Memory Usage', `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} / ${(os.totalmem() / 1024 / 1024).toFixed(2)} MB`, true)
            .addField('Uptime ', `${duration}`, true)
            .addField('Users', `${client.guilds.map(g => g.memberCount).reduce((a, b) => a + b)}`, true)
            .addField('Servers', `${client.guilds.size.toLocaleString()}`, true)
            .addField('Channels ', `${client.channels.size.toLocaleString()}`, true)
            .addField('Discord.js', `v${version}`, true)
            .addField('Node', `${process.version}`, true)
            .addField('CPU', `\`\`\`md\n${os.cpus().map(i => `${i.model}`)[0]}\`\`\``)
            .addField('CPU usage', `\`${percent.toFixed(2)}%\``, true)
            .addField('Arch', `\`${os.arch()}\``, true)
            .addField('Platform', `\`\`${os.platform()}\`\``, true));
    });
};

exports.help = {
    name: 'botstats',
    category: 'others',
    example: 'botstats',
    description: 'shows infos about this Bot',
};