const Discord = require('discord.js');
const $console = require('Console');
module.exports.run = async (client, message, args) => {
    const guild = message.guild;
    const channel = message.channel;
    if (!client.reactsave.has(guild.id) || !client.settings.has(guild.id)) {
        message.author.send(':x: Something unexpected happened\nThe developer got a notification');
        channel.send(':x: Something unexpected happened\nThe developer got a notification');
        $console.stress('data for a server was not available');
        $console.error(`guild: ${guild.name}|${guild.id}\nreactsave: ${client.reactsave.has(guild.id)}\nsettings: ${client.settings.has(guild.id)}`);
        return;
    }
    if (args[0]) args[0] = args[0].toLowerCase();
    if (args[1]) args[1] = args[1].toLowerCase();
    if (!args[0]) args[1] = 'on';

    const on_off = (args[1] === 'on') ? true : (args[1] === 'off') ? false : null;
    // If they didnt say on / off args0 will be 'wi' (wrong input)
    if (on_off === null) args[0] = 'wi';
    switch (args[0]) {
        case 'antispam':
            client.settings.setProp(guild.id, 'antispam', on_off);
            break;
        case 'highlight':
            client.settings.setProp(guild.id, 'highlight', on_off);
            break;
        case 'delete_invites':
            client.settings.setProp(guild.id, 'invite_del', on_off);
            break;
        case 'greet':
            client.settings.setProp(guild.id, 'greet', on_off);
            break;
        case 'ban_reported_user':
            client.settings.setProp(guild.id, 'ban_reported_user', on_off);
            break;
        case 'wi':
            return message.reply('Please add a `on` or `off` behind the setting.\n example: `setup antispam on`');
        default:
            channel.send(new Discord.RichEmbed()
                .setTitle('Overview')
                .addField('antispam', 'if people send messages too quickly or\nthe same they get warned and later muted', true)
                .addField('ban_reported_user', 'will ban user that are listed on dbans', true)
                .addField('highlight', 'saved keywords will be highlighed\nin logchannel', true)
                .addField('greet', 'will send join and leavemessages\nin your defined welcome channel', true)
                .addField('delete_invites', 'deletes invites to guilds. Ignores members\nwith higher positions', true)
                .setDescription('Example: `setup antispam on`')
                .setColor(client.infos.ci)
            );
            return;

    }
    return message.reply(`${args[0]} is now ${args[1]}`);
};

exports.help = {
    name: 'setup',
    category: 'settings',
    example: 'setup',
    description: 'for changing the settings',
    userPermissions: ['MANAGE_GUILD', 'MANAGE_GUILD'],
    userChannelPermissions: [],
    myPermissions: [],
    myChannelPermissions: ['SEND_MESSAGES'],
};