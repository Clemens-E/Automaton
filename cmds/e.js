const Discord = require('discord.js');
const snekfetch = require('snekfetch');
module.exports.run = async (client, message, args) => {
    if (!message.channel.permissionsFor(message.guild.me).has('SEND_MESSAGES')) return;
    if (message.author.id !== client.config.ownerid) return;
    try {
        const code = args.join(' ');
        let evaled = eval(code);
        // evaled = evaled.replace(client.token,"NDAwNzg5OTczMTg1NTkzMzQ2.DTgxDw.Qh8XS0SrX7zR3WRAC1cOsgBrvS8");
        if (typeof evaled !== 'string') { evaled = require('util').inspect(evaled); }
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
};