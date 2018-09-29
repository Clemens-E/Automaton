module.exports = async (client, member) => {
    if (!client.settings.has(member.guild.id) || !client.settings.getProp(member.guild.id, 'greet')) return;
    const greetchannel = client.settings.getProp(member.guild.id, 'greet_channel');
    if (!client.channels.has(greetchannel) || !client.channels.get(greetchannel).permissionsFor(member.guild.me).has('SEND_MESSAGES')) return;
    let wmsg = client.settings.getProp(member.guild.id, 'welcome_m');
    if (wmsg == '') {
        const premade = ['Good Bye {user}', '{user} left {guild}, press F to pay respect', '{user} left {guild}', '{user} left', '{user} left. We will miss him. maybe'];
        wmsg = premade[Math.floor(Math.random() * premade.length)];
    }
    wmsg = wmsg.replace('{user}', member.user.tag);
    wmsg = wmsg.replace('{guild}', member.guild.name);
    client.channels.get(greetchannel).send(wmsg);
};