module.exports = {
	category: 'HYPIXELSNIPER',
	name: 'denick',
	description: 'Denicks hidden player',
	guildOnly: true,
	cooldown: 15,
	minReqPermissions: ['DELETE_MESSAGES'],
	maxReqPermissions: ['ADMINISTRATOR'],
	botExecutePermissions: ['SEND_MESSAGES'],
	requireArgs: true,
	usage: 's denick <nickign>',
	stability: 'indev',
	execute(client, message) {
		message.reply('Command is disabled. Do .status');
	}
};
