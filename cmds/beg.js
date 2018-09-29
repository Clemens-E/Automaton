const random = require('random');
module.exports.run = async (client, message) => {
    await client.userp.fetch(message.author.id);
    if (!client.userp.has(message.author.id)) {
        const normal = {
            'points': 150,
        };
        client.userp.set(message.author.id, normal);
    }
    const points = client.userp.get(message.author.id, 'points');
    const bad = ['I work hard for my money!', 'No!', 'Don\'t bother me!', 'Its your fault you don\'t have money!', 'Definitely not!', 'Tomorrow or something', 'Not now', 'You will spend it on Drugs, No!'];
    const good = ['Here, get some change', 'I have a few points for you!', 'Yeah sure!', 'I hate my money, here you go!'];
    const chance = 0.93 ** points;
    if (Math.random() > chance) return message.channel.send(bad[random.int(min = 0, max = bad.length - 1)]);
    const spend = random.int(min = 4, max = 34);
    message.channel.send(good[random.int(min = 0, max = good.length - 1)] + `\n**+ ${spend} Points**`);
    client.userp.setProp(message.author.id, 'points', points + spend);
};

exports.help = {
    name: 'beg',
    category: 'entertainment',
    example: 'beg',
    description: 'If you don\'t have much points the bot will give you some',
};