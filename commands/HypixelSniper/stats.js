module.exports = {
	category: 'HYPIXELSNIPER',
	name: 'stats',
	description: 'Shows stats of player',
	guildOnly: true,
	cooldown: 15,
	minReqPermissions: ['DELETE_MESSAGES'],
	maxReqPermissions: ['ADMINISTRATOR'],
	botExecutePermissions: ['SEND_MESSAGES'],
	requireArgs: true,
    usage: 's stats <player>',
    stability: 'indev',
	execute(client, message) {
		message.reply('Command is disabled. Do .status');
	}
};
