const Discord = require('discord.js');
const $console = require('Console');
const invite_del = require('./../modules/invite_delete.js');
const highlight = require('./../modules/highlight.js');
module.exports = async (client, message) => {
    if (message.channel.type == 'dm') return;
    if (message.author.bot) return;
    if (!client.settings.has(message.guild.id)) {
        // If there is no setting for this server, create one
        const settingstmp = {
            // Prefix for the server
            prefix: '>',
            // If a Server is premium. Mostly depends if they donated
            premium: false,
            // If antispam is activated
            aspam_on: false,
            // If the bot should delete messages with invite links to other servers
            invite_del: false,
            // Channel where every important event (like ban/kick) gets logged
            log_channel: '',
            // If greet of users is active
            greet: false,
            // Channel where join and leaves should be send
            greet_channel: '',
            // Message that gets displayed when a member joins
            welcome_m: '',
            // Message that gets displayed when a member leaves
            bye_m: '',
            // If a User is listed on dbans, he gets automatically banned
            ban_reported_user: true,
            // Send Highligh reports
            highlight: false,
            // What Strings should be highlighted
            highlight_it: [],
        };
        $console.log('created settings for ' + message.guild.name + ' | ID: ' + message.guild.id);
        client.settings.set(message.guild.id, settingstmp);
    }
    if (!client.reactsave.has(message.guild.id)) {
        const reactsavetmp = {
            template_one_role: [],
            template_one_emoji: [],
            template_one_mids: [],
            template_two_role: [],
            template_two_emoji: [],
            template_two_mids: [],
            template_three_role: [],
            template_three_emoji: [],
            template_three_mids: [],
            template_four_role: [],
            template_four_emoji: [],
            template_four_mids: [],
            counter: 0,
        };
        client.reactsave.set(message.guild.id, reactsavetmp);
        $console.log('created reactsave for ' + message.guild.name + ' | ID: ' + message.guild.id);
    }

    // If invite delete is active (known as "invite_del") run the code for that
    if (client.settings.getProp(message.guild.id, 'invite_del')) invite_del.run(client, message);
    if (client.settings.getProp(message.guild.id, 'highlight')) highlight.run(client, message);
    const prefix = client.settings.getProp(message.guild.id, 'prefix');
    if (message.content.startsWith(`<@${client.user.id}>`) || message.content.startsWith(`<@!${client.user.id}>`)) {
        message.channel.send(new Discord.RichEmbed()
            .setColor(client.config.cn)
            .addField('Info', `Prefix on this Server: \`${prefix}\`\nDo \`${prefix}help\` for more information`));
    }
    if (message.content.indexOf(prefix) !== 0) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    const cmd = client.commands.get(command);
    if (!cmd) return;
    cmd.run(client, message, args);
};