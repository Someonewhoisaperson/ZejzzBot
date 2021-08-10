/*
WARNING!
ALTERING THIS FILE WITHOUT PERMISSION IS AGAINST THE LISCENCE
THIS PRODUCT COMES WITH NO WARRENTY
*/
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
		const creditEmbed = new MessageEmbed()
			.setColor('#1fde46')
			.setTitle('Birthplace of Zejzzbot')
			.setURL('https://dev.zejzz.net/zejzzbot')
			.setAuthor('Zejzz#4793', 'https://cdn.discordapp.com/avatars/717091956747927583/5ba81b63d761b09add3c22f4d0ee3991.webp?size=128')
			.setThumbnail('https://cdn.discordapp.com/avatars/717091956747927583/5ba81b63d761b09add3c22f4d0ee3991.webp?size=128')
			.setDescription('Zejzz bot is created and maintained by Zejzz#4793. It is open source and available @ https://github.com/Someonewhoisaperson/ZejzzBot')
			.setFooter(`Requested by ${message.author} at ${message.createdTimestamp}`);
		message.channel.send(creditEmbed);
	}
};
