const Discord = require('discord.js');
const fetch = require('node-fetch');
const table = require('markdown-table');
module.exports.run = async (client, message) => {
    await client.userp.fetchEverything();

    let array = [...client.userp];
    array = array.sort((a, b) => b[1].points - a[1].points);
    let urank = 'not ranked';
    for (let i = 0; i < array.length; i++) {
        if (array[i].indexOf(message.author.id) == 0) {
            urank = i + 1;
            break;
        }
    }
    let format = [
        ['Rank', 'ID', 'Name', 'Points'],
    ];
    await Promise.all(array.map(u => client.fetchUser(u[0])));
    for (let i = 0; i < array.length; i++) {
        format.push([]);
        format[i + 1].push(i + 1, array[i][0], client.users.get(array[i][0]).tag, array[i][1].points);
    }
    format = table(format);
    if (format.length > 400000) format.splice(399999, 400000);
    let link = await fetch('https://txtupload.cf/api/upload', {
        method: 'post',
        body: format,
        headers: {
            'Content-Type': 'text/plain',
        },
    });
    link = await link.json();
    message.channel.send(new Discord.RichEmbed()
        .setColor(40863)
        .setTitle(`See ${message.author.tag}'s rank`)
        .addField('**-------------------**', '** **')
        .addField(`current rank: ${urank}`, '** **')
        .addField('**-------------------**', `**[all ranks](https://txtupload.cf/${link.hash}#${link.key})**`));

};

exports.help = {
    name: 'rank',
    category: 'entertainment',
    example: 'rank',
    description: 'Shows your rank depending on your points. Also sends a link that shows all Users',
    userPermissions: [],
    userChannelPermissions: [],
    myPermissions: [],
    myChannelPermissions: ['SEND_MESSAGES'],
};