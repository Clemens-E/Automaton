const Discord = require('discord.js');
module.exports.run = async (client, message, args) => {
    const guild = message.guild;
    const channel = message.channel;
    const regex = new RegExp('/(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c[\ude32-\ude3a]|[\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g');
    let embed;
    let data;
    if (!args[0]) args[0] = 'none';
    const arr = ['one', 'two', 'three', 'four'];
    switch (args[0].toLowerCase()) {
        case 'normal':
            data = client.settings.get(guild.id);
            embed = new Discord.RichEmbed().setTitle('All Settings').setDescription(`Prefix: \`${data.prefix}\`
Premium: ${(data.premium) ? 'Yes' : 'No'}
Anti-Spam on: ${(data.antispam) ? 'Yes' : 'No'}
Delete Invites: ${(data.invite_del) ? 'Yes' : 'No'}
Log Channel: ${(client.channels.has(data.log_channel)) ? client.channels.get(data.log_channel) : 'None'}
Greet Users: ${(data.greet) ? 'Yes' : 'No'}
Greet Channel: ${(client.channels.has(data.greet_channel)) ? client.channels.get(data.greet_channel) : 'None'}
Ban Reported Users: ${(data.ban_reported_user) ? 'Yes' : 'No'}
Highlight Words: \`${(data.highlight_it.join(', ').length < 100) ? data.highlight_it.join(', ') : data.highlight_it.join(', ').substring(0, 100)}\`
`).setColor(client.infos.cn);
            break;
        case 'reactions':
            data = client.reactsave.get(guild.id);
            embed = new Discord.RichEmbed().setTitle('All Reaction Settings').setColor(client.infos.cn).setDescription(`Total roles added: ${data.counter}`);
            for (let i = 0; i < arr.length; i++) {
                embed = embed.addField(`Template ${arr[i]}`, `
  Roles:${data[`template_${arr[i]}_role`].map(r => (guild.roles.has(r)) ? (guild.roles.get(r).mentionable) ? ` ${guild.roles.get(r).toString()}` : ` \`${guild.roles.get(r).name}\`` : ' `Role doesn\'t exist`')}
  Emojis:${data[`template_${arr[i]}_emoji`].map(r => (client.emojis.has(r)) ? client.emojis.get(r).toString() : (!regex.test(r)) ? r : ' `Emoji doesn\'t exist`')}
  Message ID's: ${data[`template_${arr[i]}_mids`].map(r => ` \`${r}\``)}`);
            }
            break;
        default:
            return channel.send('I only have `normal` and `reactions`\nexample: `settings normal`');
    }

    channel.send(embed);

};

exports.help = {
    name: 'settings',
    category: 'settings',
    example: 'settings',
    description: 'Shows the current settings of the Guild',
    userPermissions: [],
    userChannelPermissions: [],
    myPermissions: [],
    myChannelPermissions: ['SEND_MESSAGES'],
};