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
	execute(message) {
		message.reply('Pong!');
	}
};
