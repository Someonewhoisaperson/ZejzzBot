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
	stability: 'stable',
	execute(client, message) {
		message.reply('Checking status...').then(async (msg) => {
			msg.delete();
			message.channel.send(`Ping:${msg.createdTimestamp - message.createdTimestamp}ms\nDiscord API Latency: ${client.ws.ping}\n`);
		});
	}
};
