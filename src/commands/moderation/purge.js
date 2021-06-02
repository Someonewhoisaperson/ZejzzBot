module.exports = {
	category: 'Moderation',
	name: 'purge',
	description: 'Mass deletes',
	aliases: ['clean'],
	guildOnly: true,
	cooldown: 7,
	minReqPermissions: ['DELETE_MESSAGES'],
	maxReqPermissions: ['DELETE_MESSAGES'],
	botExecutePermissions: ['MANAGE_MESSAGES', 'DELETE_MESSAGES'],
	requireArgs: true,
	usage: '.purge <len>',
	stability: 'beta',
	execute(client, message, args) {
		if (args[0] > 100) {
			for (var i = 0; i < (Math.floor(args[0] / 100) * 100) / 100; i++) {
				try {
					message.channel.bulkDelete(100);
				} catch (DiscordAPIError) {
					return message.channel.send(DiscordAPIError);
				}
				message.channel.send('Deleted 100 messages!');
			}
			return message.channel.send(`Unable to delete ${args[0]} so instead deleted ${Math.floor(args[0] / 100) * 100} messages`);
		}
		try {
			message.channel.bulkDelete(args[0]);
			return message.channel.send('Deleted messages');
		} catch (DiscordAPIError) {
			return message.channel.send(DiscordAPIError.message);
		}
	}
};
