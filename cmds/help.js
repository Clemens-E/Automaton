const Discord = require('discord.js');
module.exports.run = async (client, message) => {
    if (!message.channel.permissionsFor(message.guild.me).has('SEND_MESSAGES')) return;

    const prefix = client.settings.getProp(message.guild.id, 'prefix');
    const pages = [`${prefix}loghere || Makes the current channel a log channel where every action will be logged
${prefix}add(one) <rolename> || use the *exact* rolename, dont type any rolename to clear it
${prefix}reacthere one || selects the template (one) and creates the message to react on
${prefix}clearmsg || deletes all active role on react messages
See the [Documentation](https://pepmoderation.gitbook.io/pepmoderation/) If you need more instructions
Join the [Support Server](https://discord.gg/sv2qvhC) if you need more help or found a bug` ];
    const title = ['Setup'];
    let page = 1;


    let embed = new Discord.RichEmbed()
        .setColor(5243028)
        .setFooter(`Page ${page} of ${pages.length}`)
        .addField(title[page - 1], pages[page - 1]);

    message.channel.send(embed).then(msg => {

        msg.react('⏪').then(() => {
            msg.react('⏩');

            const backwardsFilter = (reaction, user) => reaction.emoji.name === '⏪' && user.id === message.author.id;
            const forwardsFilter = (reaction, user) => reaction.emoji.name === '⏩' && user.id === message.author.id;
            const backwards = msg.createReactionCollector(backwardsFilter, {
                time: 60000,
            });
            const forwards = msg.createReactionCollector(forwardsFilter, {
                time: 60000,
            });


            backwards.on('collect', r => {
                if (page === 1) return;
                page--;
                r.remove(message.author);
                embed = new Discord.RichEmbed()
                    .setColor(5243028)
                    .setFooter(`Page ${page} of ${pages.length}`)
                    .addField(title[page - 1], pages[page - 1]);
                msg.edit(embed);
            });

            forwards.on('collect', r => {
                if (page === pages.length) return;
                page++;
                r.remove(message.author);
                embed = new Discord.RichEmbed()
                    .setColor(5243028)
                    .setFooter(`Page ${page} of ${pages.length}`)
                    .addField(title[page - 1], pages[page - 1]);
                msg.edit(embed);
            });
        });
    });
};