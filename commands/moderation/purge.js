const { CommandFailEmbed, CommandSuccessEmbed, Logger } = require('../../common/common.js');

const Log = new Logger();

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
			return message.channel.send(CommandFailEmbed(message.author, 'You can only purge up to a 100 messages'));
		}
		message.channel.bulkDelete(args[0]).catch(error => {
			if (error) {
				Log.verbose(error);
				return message.channel.send(CommandFailEmbed(message.author, 'Discord API Error'));
			} else {
				return message.channel.send(CommandSuccessEmbed(message.author, `Deleted ${args[0]} messages`));
			}
		});
	}
};
