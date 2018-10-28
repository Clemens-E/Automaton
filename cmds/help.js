const Discord = require('discord.js');
module.exports.run = async (client, message) => {
    if (!message.channel.permissionsFor(message.guild.me).has('SEND_MESSAGES')) return;
    const emojis = ['⏩', '⏪', '▶', '◀'];
    const cmds = [];
    client.commands.forEach(element => {
        cmds.push(element.help);
    });
    const comds = {
        0: cmds.filter(m => m.category === 'settings'),
        1: cmds.filter(m => m.category === 'moderation'),
        2: cmds.filter(m => m.category === 'reaction role'),
        3: cmds.filter(m => m.category === 'highlight messages'),
        4: cmds.filter(m => m.category === 'entertainment'),
        5: cmds.filter(m => m.category === 'others'),
        6: cmds.filter(m => m.category === 'owner commands'),
    };
    let topicPage = 0;
    let cmdPage = 0;
    const embed = new Discord.RichEmbed()
        .setTitle('Help Text')
        .setDescription('React with ▶ to see the next command.\nReact with ⏩ to skip to the next category')
        .setColor(client.config.cn);
    const msg = await message.channel.send(embed);
    setTimeout(() => {
        msg.edit(new Discord.RichEmbed(msg.embeds[0])
            .setDescription(`Name: ${comds[topicPage][cmdPage].name}
        description: ${comds[topicPage][cmdPage].description}
        example: \`${comds[topicPage][cmdPage].example}\``).setTitle(`Category: ${comds[topicPage][cmdPage].category}`)
            .setFooter(`Command ${cmdPage + 1}/${comds[topicPage].length} | Category ${topicPage + 1}/${Object.keys(comds).length}`));
    }, 4000);
    const filter = (r, u) => u.id === message.author.id;
    const rcollector = msg.createReactionCollector(filter, {
        time: 300000,
    });
    await msg.react('◀');
    await msg.react('▶');
    await msg.react('⏪');
    await msg.react('⏩');
    rcollector.on('collect', async (r) => {
        r.remove(r.users.last()).catch((O_o) => O_o);
        if (!emojis.includes(r.emoji.name)) return;
        switch (r.emoji.name) {
            case '⏩':
                if (topicPage === Object.keys(comds).length - 1) return;
                topicPage++; cmdPage = 0;
                break;
            case '⏪':
                if (topicPage <= 0) return;
                topicPage--; cmdPage = 0;
                break;
            case '▶':
                if (cmdPage === comds[topicPage].length - 1) return;
                cmdPage++; break;
            case '◀':
                if (cmdPage <= 0) return;
                cmdPage--; break;
        }
        msg.edit(new Discord.RichEmbed(msg.embeds[0])
            .setDescription(`Name: ${comds[topicPage][cmdPage].name}
description: ${comds[topicPage][cmdPage].description}
example: \`${comds[topicPage][cmdPage].example}\``).setTitle(`Category: ${comds[topicPage][cmdPage].category}`)
            .setFooter(`Command ${cmdPage + 1}/${comds[topicPage].length} | Category ${topicPage + 1}/${Object.keys(comds).length}`));
    });

};

exports.help = {
    name: 'help',
    category: 'others',
    example: 'help <specific command>',
    description: 'shows the help dialog',
};