const Discord = require('discord.js');
const $console = require('Console');
module.exports = async (client, reaction, user, index) => {
    if (user === client.user) return;
    const data = client.reactsave.get(reaction.message.guild.id);
    if (index === 0) index = 'one';
    else if (index === 1) index = 'two';
    else if (index === 2) index = 'three';
    else if (index === 3) index = 'four';
    const emoji = reaction.emoji.id || reaction.emoji.name;
    const guild = reaction.message.guild;
    const position = data[`template_${index}_emoji`].indexOf(emoji);
    let role = data[`template_${index}_role`][position];
    if (role < 0) return;
    role = (guild.roles.has(role)) ? guild.roles.get(role) : undefined;

    const logchannel = client.getLogchannel(guild.id);

    // If the role doesnt exist send a message if possible and return
    if (!role && !logchannel) return;
    else if (!role && logchannel) return logchannel.send(new Discord.RichEmbed().setDescription(`tried removing role with the ID \`${data[`template_${index}_role`][position]}\` to ${user.tag}\nrole does not exists`));

    const member = await reaction.message.guild.fetchMember(user.id);
    if (!member.roles.has(role.id)) return;

    // If the client does not have enough permissions, send a message if possible and return
    if (!guild.me.permissions.has('MANAGE_ROLES') && logchannel) return logchannel.send(new Discord.RichEmbed().setDescription(`tried removing role ${(role.mentionable) ? `${role}` : `"${role.name}"`} to ${member}.\nmissing permission: \`manage roles\``));
    else if (!guild.me.permissions.has('MANAGE_ROLES')) return;

    // If the role has more permissions than the bot we will get a promise rejection when we try to add the role
    if (role.comparePositionTo(guild.me.highestRole) >= 0 && logchannel) return logchannel.send(new Discord.RichEmbed().setDescription(`tried removing role ${(role.mentionable) ? `${role}` : `"${role.name}"`} to ${member}.\nThe roles position equals or exceeds mine.`));
    else if (role.comparePositionTo(guild.me.highestRole) >= 0) return;
    let success = true;
    await member.removeRole(role.id).catch(err => {
        success = false;
        $console.error(err);
    });
    if (logchannel && !success) logchannel.send(new Discord.RichEmbed().setColor(client.config.ce).setDescription(`tried removing role ${(role.mentionable) ? `${role}` : `"${role.name}"`} to ${member}.\nunknown error! This was reported to the developer and soon be fixed`));
    else if (logchannel && success) logchannel.send(new Discord.RichEmbed().setColor(client.config.cs).setDescription(`removed role ${(role.mentionable) ? `${role}` : `"${role.name}"`} to ${member}`));
    else if (!logchannel && !success) member.send(`The bot had trouble removing the role "${role.name}" to you.\nThis was reported to the developer and soon be fixed`);

};