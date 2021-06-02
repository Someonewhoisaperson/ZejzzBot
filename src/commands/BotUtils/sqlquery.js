module.exports = {
	category: 'BotUtils',
	name: 'sqlquery',
	description: 'Runs a mysql query',
	aliases: [''],
	guildOnly: true,
	cooldown: 3,
	minReqPermissions: ['DELETE_MESSAGES'],
	maxReqPermissions: ['ADMINISTRATOR'],
	botExecutePermissions: ['SEND_MESSAGES'],
	requireArgs: true,
	botAdminOnly: true,
	usage: 'sqlquery <*args>',
	stability: 'Dangerous',
	execute(client, message) {
		message.reply('Disabled');
	}
};
