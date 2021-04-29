module.exports = {
	category: 'BotUtils',
	name: 'ping',
	description: 'Ping!',
	aliases: ['pong'],
	minReqPermissions: ['DELETE_MESSAGES'],
	maxReqPermissions: ['ADMINISTRATOR'],
	botExecutePermissions: ['SEND_MESSAGES'],
	requireArgs: true,
	usage: 'ping',
	execute(message) {
		message.reply('Pong.');
	}
};
