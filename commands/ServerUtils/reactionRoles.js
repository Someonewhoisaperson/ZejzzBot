const { MessageEmbed } = require('discord.js');

module.exports = {
	category: 'BotUtils',
	name: 'credits',
	description: 'Shows the credits for the bot',
	aliases: ['whoareyou'],
	guildOnly: true,
	cooldown: 5,
	minReqPermissions: ['SEND_MESSAGES'],
	maxReqPermissions: ['SEND_MESSAGES'],
	botExecutePermissions: ['SEND_MESSAGES'],
	requireArgs: false,
	usage: 'credits',
	stability: 'indev',
	execute(client, message) {
		// use interactions  https://discordjs.guide/interactions/replying-to-slash-commands.html  https://discordjs.guide/interactions/registering-slash-commands.html#global-commands
		const setupReactionRolesEmbed1 = new MessageEmbed()
			.setColor('#1fde46')
			.setTitle('Reaction Role Creation Wizard')
			.setURL('https://dev.zejzz.net/zejzzbot')
			.setDescription('Follow the prompts in order to setup reaction roles for your server!')
			.setFooter(`Requested by ${message.author} at ${message.createdTimestamp}`);
	}
};
