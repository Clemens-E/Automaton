const $console = require('Console');
const Discord = require('discord.js');
const randomWords = require('random-words');
const hangman = require('hangman-game-engine');
module.exports.run = async (client, message) => {
    const func = () => {
        setTimeout(() => {
            if (!messages[count - 1] || messages[count - 1].createdTimestamp < Date.now() - 60000) {
                mcollector.stop();
            }
        }, 60200);
    };
    const guild = message.guild;
    const channel = message.channel;
    const member = message.member;
    if (!channel.permissionsFor(guild.me).has('SEND_MESSAGES')) return message.author.send(`I can't send messages in ${channel}. Please make sure I can and try again.`);
    if (!client.reactsave.has(guild.id) || !client.settings.has(guild.id)) {
        message.author.send(':x: Something unexpected happened\nThe developer got a notification');
        channel.send(':x: Something unexpected happened\nThe developer got a notification');
        $console.stress('data for a server was not available');
        $console.error(`guild: ${guild.name}|${guild.id}\nreactsave: ${client.reactsave.has(guild.id)}\nsettings: ${client.settings.has(guild.id)}`);
        return;
    }
    await client.userp.fetch(message.author.id);
    if (!client.userp.has(message.author.id)) client.userp.set(message.author.id, { 'points': 150 });
    const points = client.userp.get(message.author.id, 'points');
    if (points < 30) return message.reply(`You need at least \`30\` points. But you only have ${points}`);
    const messages = [];
    messages.push(message);
    messages.push(await channel.send('Reply with only one letter. multiple letters in one message will not be accepted. Send a `0` to cancel'));
    let count = 0;
    const word = randomWords();
    func();
    const msg = await channel.send(word.replace(/./g, '-'));
    messages.push(msg);
    const game = new hangman(word);

    const filter = m => m.author.id === message.author.id && m.content.length === 1;
    const mcollector = channel.createMessageCollector(filter);
    mcollector.on('collect', async (m) => {
        count++;
        messages.push(m);
        if (m.content === '0') mcollector.stop();
        func();
        game.guess(m.content);
        msg.edit(`\`${game.hiddenWord.join('')}\``);
        if (game.status !== 'IN_PROGRESS') mcollector.stop();

    });

    mcollector.on('end', () => {
        if (game.status === 'IN_PROGRESS') {
            if (messages.length <= 99 && messages.length > 0) channel.bulkDelete(messages).catch((O_o) => O_o);
            return channel.send('No answer passed or command was cancelled. Mission abort!');
        }
        channel.send(new Discord.RichEmbed().setTitle(`${member.user.tag}'s Game result`).setDescription(`The Word was: \`${game.word}\`\nTotal Guesses: \`${game.totalGuesses}\`\nWrong Guesses: \`${game.failedGuesses}\`\nStatus: \`${game.status}\`\n\`${(game.status === 'WON') ? '+ 90 Points' : '- 30 Points'}\``).setColor(client.config.ci));
        if (game.status === 'WON') client.userp.setProp(member.id, 'points', points + 60);
        else client.userp.setProp(member.id, 'points', points - 30);
        if (messages.length <= 99 && messages.length > 0) channel.bulkDelete(messages).catch((O_o) => O_o);
    });

};
