const Discord = require('discord.js');
module.exports.run = async (client, message, args) => {
    const guild = message.guild;
    const channel = message.channel;
    let embed;
    let data;
    if (!args[0]) args[0] = 'none';
    const arr = ['one', 'two', 'three', 'four'];
    switch (args[0].toLowerCase()) {
        case 'normal':
            data = client.settings.get(guild.id);
            embed = new Discord.RichEmbed().setTitle('All Settings').setDescription(`Prefix: \`${data.prefix}\`
Premium: ${(data.premium) ? 'Yes' : 'No'}
Anti-Spam on: ${(data.aspam_on) ? 'Yes' : 'No'}
Delete Invites: ${(data.invite_del) ? 'Yes' : 'No'}
Log Channel: ${(client.channels.has(data.log_channel)) ? client.channels.get(data.log_channel) : 'None'}
Greet Users: ${(data.greet) ? 'Yes' : 'No'}
Greet Channel: ${(client.channels.has(data.greet_channel)) ? client.channels.get(data.greet_channel) : 'None'}
Ban Reported Users: ${(data.ban_reported_user) ? 'Yes' : 'No'}
`).setColor(client.config.cn);
            break;
        case 'reactions':
            data = client.reactsave.get(guild.id);
            embed = new Discord.RichEmbed().setTitle('All Reaction Settings').setColor(client.config.cn).setDescription(`Total roles added: ${data.counter}`);
            for (let i = 0; i < arr.length; i++) {
                embed = embed.addField(`Template ${arr[i]}`, `
  Roles:${data[`template_${arr[i]}_role`].map(r => (guild.roles.has(r)) ? (guild.roles.get(r).mentionable) ? ` ${guild.roles.get(r).toString()}` : ` \`${guild.roles.get(r).name}\`` : ' `Role doesn\'t exist`')}
  Emojis:${data[`template_${arr[i]}_emoji`].map(r => (client.emojis.has(r)) ? ` ${client.emojis.get(r).toString()}` : ' `Emoji doesn\'t exist`')}
  Message ID's: ${data[`template_${arr[i]}_mids`].map(r => ` \`${r}\``)}
  `);
            }
            break;
        default:
            return channel.send('I only have `normal` and `reactions`');
    }

    channel.send(embed);

};

exports.help = {
    name: 'settings',
    category: 'settings',
    example: 'settings',
    description: 'Shows the current settings of the Guild',
};