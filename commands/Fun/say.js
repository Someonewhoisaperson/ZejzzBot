module.exports = {
	category: 'Fun',
	name: 'say',
	description: 'Ping!',
	aliases: ['speak'],
	guildOnly: true,
	cooldown: 5,
	minReqPermissions: ['MANAGE_MESSAGES'],
	maxReqPermissions: ['ADMINISTRATOR'],
	botExecutePermissions: ['MANAGE_MESSAGES', 'MENTION_EVERYONE'],
	requireArgs: true,
	usage: 'say <args*>',
	stability: 'release',
	execute(client, message, args) {
		message.channel.send(args.join(' '));
	}
};
