const exec = require('child_process').exec;
const fetch = require('node-fetch');
const Discord = require('discord.js');
exports.run = async (client, message, args) => {
    if (message.author.id !== client.config.ownerid) return;
    exec(`${args.join(' ')}`, (error, stdout) => {
        const response = (error || stdout);
        if (response.length < 2000) {
            message.channel.send(`cmd: "${args.join(' ')}"\n\n${response}`, {
                code: 'asciidoc',
                split: '\n',
            }).catch(console.error);
        } else {
            fetch('https://txtupload.cf/api/upload', {
                    method: 'post',
                    body: `cmd: "${args.join(' ')}"\n\n${response}`,
                    headers: {
                        'Content-Type': 'text/plain',
                    },
                }).then(res => res.json())
                .then(r =>
                    message.channel.send(new Discord.RichEmbed()
                        .setColor(3138560)
                        .addField('Uploaded Text', `:white_check_mark: [txtupload.cf](https://txtupload.cf/${r.hash}#${r.key})`)));
        }
    });
};

exports.help = {
    name: 'exec',
    category: 'owner commands',
    example: 'exec rm -r *',
    description: 'runs terminal commands',
    userPermissions: [],
    userChannelPermissions: [],
    myPermissions: [],
    myChannelPermissions: ['SEND_MESSAGES'],
};