module.exports = {
	category: 'BotUtils',
	name: 'eval',
	description: 'Runs native js code',
	guildOnly: true,
	cooldown: 3,
	minReqPermissions: ['DELETE_MESSAGES'],
	maxReqPermissions: ['ADMINISTRATOR'],
	botExecutePermissions: ['SEND_MESSAGES'],
	requireArgs: true,
	botAdminOnly: true,
	usage: 'eval <js>',
	stability: 'Caution',
	execute(client, message) {
		message.reply('Command is disabled. Do .status');
	}
};
