module.exports = {
	category: 'BotUtils',
	name: 'ping',
	description: 'Ping!',
	aliases: ['pong'],
	guildOnly: true,
	cooldown: 5,
	minReqPermissions: ['DELETE_MESSAGES'],
	maxReqPermissions: ['ADMINISTRATOR'],
	botExecutePermissions: ['SEND_MESSAGES'],
	requireArgs: true,
	usage: 'ping',
	stability: 'disabled',
	execute(client, message) {
		message.reply('Command is disabled. Do .status');
	}
};
