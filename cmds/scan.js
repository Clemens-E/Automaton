const Discord = require('discord.js');
module.exports.run = async (client, message) => {
    // API Down
    return;
    let output = '';
    let banned = 0;
    const msg = await message.channel.send('<a:wow:478355746946416642> Checking Members');
    await message.guild.members.forEach(async (m) => {
        const r = await client.dbans.lookup(m.id);
        if (r.banned) {
            output += `${client.users.get(r.user_id)} ID: (${r.user_id}) was banned on [DBANS](https://bans.discord.id/)\n`;
            banned++;
        }
    });
    setTimeout(function () {
        msg.edit(new Discord.RichEmbed()
            .setColor(40863)
            .setTitle('**Scan results**')
            .addField('use the `cleanup` command to ban all users with reports', '** **')
            .setDescription(`${(output.length > 1) ? `${(banned > 100) ? `${banned} Users have a report on [DBANS](https://bans.discord.id/)` : `${output}`}` : 'No reported user found'}`));
    }, 10000);
};

exports.help = {
    name: 'scan',
    category: 'moderation',
    example: 'scan',
    description: 'scans the whole server. Every User banned on DBANS will get showed',
};