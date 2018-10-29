const Discord = require('discord.js');
const $console = require('Console');
module.exports.run = async (client, message) => {
    // API Down
    return;
    let banned = '';
    let bannd = 0;
    if (!message.member.hasPermission('BAN_MEMBERS')) return message.channel.send('You don\'t have enough permissions to ban members');
    const msg = await message.channel.send('<a:wow:478355746946416642> Checking Members');
    await message.guild.members.forEach(async (m) => {
        const r = await client.dbans.lookup(m.id);
        let success = true;
        if (r.banned) {
            if (message.guild.me.permissions.has('BAN_MEMBERS') && m.highestRole.position < message.guild.me.highestRole.position) {
                bannd++;
                m.ban('reported in DBANS').catch(err => {
                    success = false;
                    $console.error(err);
                });
                if (!success) banned += `error while banning ${m}`;
                else banned += `banned ${m}\n`;
            }
            else {
                banned += `no permission | can't ban ${m}\n`;
            }
        }
    });
    setTimeout(function () {
        msg.edit(new Discord.RichEmbed()
            .setColor(client.infos.cw)
            .setTitle('**Scan results**')
            .addField(`Banned ${bannd} ${(bannd == 1) ? 'Member' : 'Members'}`, '** **')
            .setDescription(`${(banned.length > 1) ? `${(bannd > 100) ? `${bannd} Users have been banned` : `${banned}`}` : 'No reported user found'}`));
    }, 10000);
};

exports.help = {
    name: 'cleanup',
    category: 'moderation',
    example: 'cleanup',
    description: 'scans the whole server. Every user banned on DBANS will get banned on the server',
};