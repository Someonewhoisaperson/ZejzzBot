module.exports = {
	category: 'BotUtils',
	name: 'say',
	description: 'Ping!',
    aliases: ['pong'],
    guildOnly: true,
	minReqPermissions: ['MANAGE_MESSAGES'],
	maxReqPermissions: ['ADMINISTRATOR'],
	botExecutePermissions: ['MANAGE_MESSAGES', 'MENTION_EVERYONE'],
	requireArgs: true,
	usage: 'say <args*>',
	execute(message, args) {
		message.channel.send(args.join(' '));
	}
};
