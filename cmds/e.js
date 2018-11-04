/* eslint-disable no-unused-vars */
const Discord = require('discord.js');
const snekfetch = require('snekfetch');
const child = require('child_process');
module.exports.run = async (client, message, args) => {
    if (message.author.id !== client.config.ownerid) return;
    const channel = message.channel;
    const guild = message.guild;
    try {
        const code = args.join(' ');
        let evaled = eval(code);
        if (typeof evaled !== 'string') { evaled = require('util').inspect(evaled); }
        evaled = evaled.replace(client.token, '"No"');
        if (evaled.length < 2000) {
            message.channel.send(clean(evaled), {
                code: 'xl',
            });
        }
        else {
            snekfetch.post('https://paste.discord.land/documents').send(evaled).then(body => {
                message.channel.send(new Discord.RichEmbed()
                    .setColor(3138560)
                    .addField('Uploaded Text', ':white_check_mark: Posted text to Hastebin! URL: https://paste.discord.land/' + body.body.key));
            });
        }
    }
    catch (err) {
        if (!message.channel.permissionsFor(message.guild.me).has('SEND_MESSAGES')) return;
        message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
    }
};

function clean(text) {
    if (typeof (text) === 'string') { return text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203)); }
    else { return text; }
}

exports.help = {
    name: 'eval',
    category: 'owner commands',
    example: 'e client.token',
    description: 'runs js code',
    userPermissions: [],
    userChannelPermissions: [],
    myPermissions: [],
    myChannelPermissions: ['SEND_MESSAGES'],
};