const authors = [];
const banned = [];
const warned = [];
const messagelog = [];


module.exports = function (client) {
    const warningMessage = 'You are writing fast or you send the exact same message every time. Please slow down or you *will* be banned.';
    const set = (enmap, search, norm) => (enmap.hasOwnProperty(search)) ? enmap[search] : norm;

    client.on('message', msg => {
        if (msg.author.bot) return;
        if (msg.attachments.size > 0) return;
        if (!client.settings.has(msg.guild.id)) return;
        if (!client.settings.getProp(msg.guild.id, 'antispam')) return;
        const map = client.settings.get(msg.guild.id);

        // If there aren't any specific settings just take the default.
        const warnBuffer = set(map, 'warnBuffer', 5);
        const maxBuffer = set(map, 'maxBuffer', 8);
        const interval = set(map, 'interval', 5000);
        const maxDuplicatesWarning = set(map, 'maxDuplicatesWarning', 5);
        const maxDuplicatesBan = set(map, 'maxDuplicatesBan', 8);


        const now = Math.floor(Date.now());
        authors.push({
            time: now,
            author: msg.author.id,
        });
        messagelog.push({
            message: msg.content,
            author: msg.author.id,
            time: now,
        });

        // To not fill the ram we cut it down when it gets too big.
        if (messagelog.length > 500) {
            messagelog.shift();
        }

        // Remove old message logs to prevent warning people saying "Hi" 5 times a day.
        for (let index = messagelog.length; index > 0; index--) {
            if (now <= messagelog.time + 300000) break;
            messagelog.splice(index);
        }
        // Check how many times the same message has been sent.
        let msgMatch = 0;
        for (let i = 0; i < messagelog.length; i++) {
            if (messagelog[i].message === msg.content && (messagelog[i].author === msg.author.id)) {
                msgMatch++;
            }
        }
        // Check matched count
        if (msgMatch === maxDuplicatesWarning && !warned.includes(msg.author.id)) {
            warn(msg);
        }
        if (msgMatch === maxDuplicatesBan && !banned.includes(msg.author.id)) {
            ban(msg);
        }

        let matched = 0;
        for (let i = 0; i < authors.length; i++) {
            if (authors[i].time > now - interval) {
                matched++;
                if (matched === warnBuffer && !warned.includes(msg.author.id)) {
                    warn(msg);
                }
                if (matched === maxBuffer && !banned.includes(msg.author.id)) {
                    ban(msg);
                }
            }
            else if (authors[i].time < now - interval) {
                authors.splice(i);
                warned.splice(warned.indexOf(authors[i]));
                banned.splice(warned.indexOf(authors[i]));
            }
        }
    });

    /**
     * Warn a user
     * @param  {Object} msg
     */
    function warn(msg) {
        warned.push(msg.author.id);
        if (msg.member.highestRole.position >= msg.guild.me.highestRole.position) return;
        msg.channel.send(msg.author + ' ' + warningMessage).then((mes) => mes.delete(5000));
    }

    /**
     * Ban a user by the user id
     * @param  {Object} msg
     * @return {boolean} True or False
     */
    function ban(msg) {
        if (msg.member.highestRole.position >= msg.guild.me.highestRole.position) return;
        for (let i = 0; i < messagelog.length; i++) {
            if (messagelog[i].author === msg.author.id) {
                messagelog.splice(i);
            }
        }
        banned.push(msg.author.id);
        msg.channel.send(`banning ${msg.author.tag}...`).then(m => {
            msg.member.ban(1, 'banned for spamming').then(() => {
                m.edit(`banned ${msg.author.tag} for spamming.`);
                if (client.getLogChannel(msg.guild.id)) client.getLogChannel(msg.guild.id).send(`banned ${msg.author.tag} for spamming.`);
            }).catch(() => {
                m.edit(`failed banning ${msg.author.tag}`);
                if (client.getLogChannel(msg.guild.id)) client.getLogChannel(msg.guild.id).send(`failed banning ${msg.author.tag} for spamming.`);
            });
        });
    }

};