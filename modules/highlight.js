const Discord = require('discord.js');
module.exports.run = async (client, message) => {
    const words = client.settings.get(message.guild.id, 'highlight_it');
    const content = message.content;
    const filtered = words.filter((c) => content.includes(c));
    if (filtered.length === 0) return;
    const logchannel = client.getLogChannel(message.guild.id);
    // What should I do without a logchannel? exactly nothing!
    if (!logchannel) return;

    // Get the last 3 messages in that channel.
    const lastMessages = message.channel.messages.array().slice(-3).filter((m) => !m.author.bot);
    const output = lastMessages.map((m) => `${m.author.tag}: ${(m.content.length > 100) ? `${m.content.substring(0, 100)}...` : m.content}`);
    const embed = new Discord.RichEmbed().setColor(client.infos.ci).setDescription(`${message.member} wrote a [highlighted Word](${message.url}) in ${message.channel}\nChat History:\n\`\`\`fix\n${output.join('\n')}\`\`\``);
    const msg = await logchannel.send(embed.setFooter('React with 🗑 to delete the message (10 Minutes Time)'));
    await msg.react('🗑');
    const filter = (r, u) =>
        message.channel.permissionsFor(u).has('MANAGE_MESSAGES') && r.emoji.name === '🗑' && !u.bot;

    const rcollector = msg.createReactionCollector(filter, {
        time: 600000,
    });
    rcollector.on('collect', async (r) => {
        message.delete().then(() =>
            msg.edit(embed.setFooter(`Message deleted by ${r.users.last().tag} (ID: ${r.users.last().id})`))
        ).catch(() =>
            msg.edit(embed.setFooter('No Permission to delete that message'))
        );
        rcollector.stop();
    });

};