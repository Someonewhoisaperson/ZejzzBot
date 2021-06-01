module.exports = {
	category: 'HYPIXELSNIPER',
	name: 'status',
	description: 'Shows sniper status',
	guildOnly: true,
	cooldown: 15,
	minReqPermissions: ['DELETE_MESSAGES'],
	maxReqPermissions: ['ADMINISTRATOR'],
	botExecutePermissions: ['SEND_MESSAGES'],
	requireArgs: true,
	usage: 's status',
	stability: 'beta',
	execute(client, message) {
		message.reply('Command is disabled. Do .status');
	}
};
