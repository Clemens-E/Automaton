const Discord = require('discord.js');
module.exports = async (client, member) => {

    if (!client.settings.has(member.guild.id)) return;
    const greet = client.settings.getProp(member.guild.id, 'greet');
    // Get both channels. If no permissions make it undefined
    let greetchannel = client.settings.getProp(member.guild.id, 'greet_channel');
    greetchannel = (client.channels.has(greetchannel) && client.channels.get(greetchannel).permissionsFor(member.guild.me).has('SEND_MESSAGES')) ? client.channels.get(greetchannel) : undefined;
    let logchannel = client.settings.getProp(member.guild.id, 'log_channel');
    logchannel = (client.channels.has(logchannel) && client.channels.get(logchannel).permissionsFor(member.guild.me).has('SEND_MESSAGES')) ? client.channels.get(logchannel) : undefined;

    if (greetchannel && greet) {
        let wmsg = client.settings.getProp(member.guild.id, 'welcome_m');
        if (wmsg === '') {
            const premade = ['Hello {user}, we waited for you!', 'Hey {user}, welcome to {guild}', '{user} arrived O_o', '{user} is here, as the prophecy foretold.', '{user} is here to kick butt and chew bubblegum. And {user} is all out of gum.'];
            wmsg = premade[Math.floor(Math.random() * premade.length)];
        }
        wmsg = wmsg.replace('{user}', member.toString());
        wmsg = wmsg.replace('{guild}', member.guild.name);
        greetchannel = client.channels.get(greetchannel);
        greetchannel.send(wmsg);
    }
    // Search for the user in DBANS
    const search = await client.dbans.lookup(member.id);
    if (!search.banned) return;

    if (client.settings.getProp(member.guild.id, 'ban_reported_user')) {
        if (member.bannable) {
            member.ban('reported on dbans');
            if (logchannel) {
                logchannel.send(new Discord.RichEmbed()
                    .setColor(3127860)
                    .setDescription(`banned ${member} because he is listed on DBANS\nReason: ${search.reason}\n[Proof](${search.proof})`));
            }
        }
        else if (logchannel) {
            logchannel.send(new Discord.RichEmbed()
                .setColor(13908020)
                .setDescription(`tried to ban ${member} because he is listed on DBANS\nReason: ${search.reason}\n[Proof](${search.proof})\nSadly I can't ban him`));
        }
    }
    else {
        if (greetchannel) greetchannel.send(`${member} is reported on DBANS, be careful!\nReason: ${search.reason}`);
        if (logchannel) {
            logchannel.send(new Discord.RichEmbed()
                .setColor(13908020)
                .setDescription(`be careful with ${member} because he is listed on DBANS\nReason: ${search.reason}\n[Proof](${search.proof})`)
                .setFooter('see settings to ban reported users automatically | use cleanup to ban all reported users'));
        }
    }


};