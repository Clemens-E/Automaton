const $console = require('Console');
const Discord = require('discord.js');
module.exports.run = async (client, message, args) => {
    const guild = message.guild;
    const channel = message.channel;
    if (!message.channel.permissionsFor(message.guild.me).has('SEND_MESSAGES')) return message.author.send(`I can't send messages in ${message.channel}. Please make sure I can and try again.`);
    if (!client.reactsave.has(guild.id) || !client.settings.has(guild.id)) {
        message.author.send(':x: Something unexpected happened\nThe developer got a notification');
        channel.send(':x: Something unexpected happened\nThe developer got a notification');
        $console.stress('data for a server was not available');
        $console.error(`guild: ${guild.name}|${guild.id}\nreactsave: ${client.reactsave.has(guild.id)}\nsettings: ${client.settings.has(guild.id)}`);
        return;
    }
    const userperm = message.member.permissions;
    if (!userperm.has('MANAGE_ROLES')) return channel.send('You don\'t have enough permissions. You need\n`Manage Roles`\n');
    const template = (args[0]) ? args[0].toLowerCase() : '';
    const messages = [];
    const premium = client.settings.getProp(guild.id, 'premium');
    const data = client.reactsave.get(guild.id);
    const available = ['one', 'two', 'three', 'four'];
    let roletodelete;
    let emojitodelete;
    let deleted = 0;
    switch (template) {
        case 'one':
        case 'two':
            break;
        case 'three':
        case 'four':
            if (!premium) return channel.send('Sorry, you need premium to have more than 2 templates');
            break;
        case 'non-available':
            for (let i = 0; i < available.length; i++) {
                const dataemoji = data[`template_${available[i]}_emoji`];
                const datarole = data[`template_${available[i]}_emoji`];
                for (let index = 0; index < dataemoji.length; index++) {
                    const element = dataemoji[index];
                    if (element.length < 17) continue;
                    if (client.emojis.has(element)) continue;
                    deleted++;
                    client.reactsave.removeFrom(guild.id, `template_${available[i]}_emoji`, dataemoji[index]);
                    client.reactsave.removeFrom(guild.id, `template_${available[i]}_role`, datarole[index]);
                }
            }
            for (let i = 0; i < available.length; i++) {
                const dataemoji = data[`template_${available[i]}_emoji`];
                const datarole = data[`template_${available[i]}_emoji`];
                for (let index = 0; index < dataemoji.length; index++) {
                    const element = datarole[index];
                    if (guild.roles.has(element)) continue;
                    deleted++;
                    client.reactsave.removeFrom(guild.id, `template_${available[i]}_emoji`, dataemoji[index]);
                    client.reactsave.removeFrom(guild.id, `template_${available[i]}_role`, datarole[index]);
                }
            }
            channel.send(new Discord.RichEmbed()
                .setColor(client.config.ci)
                .setDescription(`I deleted ${deleted} emojis and it's binded roles`));
            break;
        default:
            return channel.send('I don\'t have that template.\nOnly `one`, `two`. (only premium):`three` and `four`.\nIf you want to sort out all emojis and roles that are deleted use `non-available`');
    }
    if (template === 'non-available') return;
    messages.push(message);
    const msg = await channel.send('Please react on this message with the emoji you want to remove. `60 Seconds time`');
    messages.push(msg);
    const filter = (r, u) => u.id === message.author.id;
    const time = new Date().getTime();
    const rcollector = msg.createReactionCollector(filter, {
        time: 60000,
    });
    rcollector.on('collect', async (r) => {
        r.remove(r.users.last());
        const position = data[`template_${template}_emoji`].indexOf(r.emoji.id || r.emoji.name);
        if (position < 0) return messages.push(await channel.send(`I can't find "${r.emoji.toString()}" in my Database,. Try again! (${Math.floor((rcollector.options.time - (new Date().getTime() - time)) / 1000)} Seconds left)`));
        emojitodelete = r.emoji.id || r.emoji.name;
        roletodelete = data[`template_${template}_role`][position];
        const roleout = (guild.roles.has(roletodelete)) ? (guild.roles.get(roletodelete).mentionable) ? `${guild.roles.get(roletodelete).toString()}` : `\`${guild.roles.get(roletodelete).name}\`` : `Roles doesnt exist. ID: ${roletodelete}`;
        messages.push(await channel.send(`I found ${roleout}`));
        messages.push(await channel.send('I will remove the role and the emoji now.'));
        client.reactsave.removeFrom(guild.id, `template_${template}_emoji`, emojitodelete);
        client.reactsave.removeFrom(guild.id, `template_${template}_role`, roletodelete);
        rcollector.stop();
    });
    rcollector.on('end', async () => {
        if (!emojitodelete) {
            if (messages.length <= 99 && messages.length > 0) channel.bulkDelete(messages).catch((O_o) => O_o);
            return channel.send('No correct reaction found. Time went out.');
        }
        const roleout = (guild.roles.has(roletodelete)) ? (guild.roles.get(roletodelete).mentionable) ? `${guild.roles.get(roletodelete).toString()}` : `\`${guild.roles.get(roletodelete).name}\`` : `Roles doesnt exist. ID: ${roletodelete}`;
        if (messages.length <= 99 && messages.length > 0) channel.bulkDelete(messages).catch((O_o) => O_o);
        channel.send(new Discord.RichEmbed()
            .setColor(client.config.ci)
            .setDescription(`The Emoji "${client.emojis.get(emojitodelete).toString() || emojitodelete}" and the binded role "${roleout}" are deleted`));
    });

};

exports.help = {
    name: 'remove',
    category: 'reaction role',
    example: 'remove',
    description: 'Removing a role and a emoji from a template',
};