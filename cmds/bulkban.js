const Discord = require('discord.js');
module.exports.run = async (client, message, args) => {
    if (!message.member.hasPermission('BAN_MEMBERS')) return message.channel.send('You don\'t have enough permissions to ban members');
    if (!message.guild.me.permissions.has('BAN_MEMBERS')) return message.channel.send('I don\'t have enough permissions to ban members');
    if (args.length > 20) return message.channel.send('Only 20 IDs maximum');
    if (!args[0]) return message.channel.send('Please provide at least one user ID');
    const embed = new Discord.RichEmbed().setColor(client.config.cs).setTitle('Bulk Ban result');
    const guild = await message.guild.fetchMembers();
    let banned = '';
    const members = [];
    args.forEach(id => {
        const member = guild.members.get(id);
        if (!member) return members.push(id);
        if (member.highestRole.comparePositionTo(message.member) >= 0) return banned += `${member}'s highest role position equals or exceeds yours.\n`;
        if (!member.bannable) return banned += `I can't ban ${member}\n`;
        members.push(member);
    });

    Promise.all(members.map(u => message.guild.ban(u).then().catch((O_o) => O_o))).then((r) => {
        r.forEach(element => {
            if (element.code) return;
            if (typeof element === 'string') return banned += `user is probably already banned (ID: ${element})\n`;
            banned += `banned ${element.tag} (ID: ${element.id})\n`;
        });
        message.channel.send(embed.setDescription(banned));
    });

};

exports.help = {
    name: 'bulkban',
    category: 'moderation',
    example: 'bulkban 139412744439988224 146048938242211840',
    description: 'bans all given user IDs. good for banning multiple raiders or preventing them',
};