const Discord = require('discord.js');
const $console = require('Console');
module.exports = async (client, guild) => {
    const mcount = guild.memberCount;
    const bcount = guild.members.filter(m => m.user.bot).size;
    if (bcount > 7 && mcount < bcount) {
        guild.owner.send(`Hey, your guild has ${bcount} Bots and only ${mcount}. I dont like that, I will leave`);
        guild.leave();
        client.channels.get('461211772804792320').send(new Discord.RichEmbed().setDescription(`Instant Leaved Guild ${guild.name} with ${mcount} members and ${bcount} bots.`).setColor(8135099));
        return $console.stress(`Instant Leaved Guild ${guild.name} with ${mcount} members and ${bcount} bots.`);
    }
    $console.success(`joined new guild | ${guild.name} | ${guild.memberCount}`);
    client.channels.get('461211772804792320').send(new Discord.RichEmbed()
        .setColor(3127860)
        .addField('*Joined a new Guild*', 'New Guild <a:wow:478355746946416642>')
        .addField('ID', guild.id, true)
        .addField('Name', guild.name, true)
        .addField('Owner', guild.owner.user.tag, true)
        .addField('Region', guild.region, true)
        .addField('Channels', guild.channels.size, true)
        .addField('Members', guild.memberCount, true)
        .addField('Humans', guild.memberCount - guild.members.filter(m => m.user.bot).size, true)
        .addField('Bots', guild.members.filter(m => m.user.bot).size, true)
        .addField('Guilds in total', `${client.guilds.size}`)).catch((O_o) => O_o);
    const possiblechannels = guild.channels.filter((c) => c.permissionsFor(guild.me).has('SEND_MESSAGES'));
    if (possiblechannels.size === 0) return;
    possiblechannels.last().send(new Discord.RichEmbed()
        .setColor(3127860)
        .addField('*Hello! Iam Automaton*', 'Thanks for adding me to your server!')
        .addField('Find help:', '[Full Documentation](https://automaton.gitbook.io/automaton/ "Official Docs")', true)
        .addField('My default prefix is `>`. If you ever forget it,\njust ping me in the beginning of the message and I will tell you!')
        .setFooter(`this is the ${client.guilds.size} guild I joined.`));

};