const Discord = require('discord.js');

module.exports = {
	category: 'BotUtils',
	name: 'embed',
	description: 'Creates an embed with the specified parameters',
	aliases: [],
	guildOnly: false,
	cooldown: 20,
	minReqPermissions: ['SEND_MESSAGES'],
	maxReqPermissions: ['SEND_MESSAGES'],
	botExecutePermissions: ['MANAGE_MESSAGES', 'MENTION_EVERYONE'],
	requireArgs: true,
	usage: 'embed <TBA> <HI> <OPTIONS SOON XD> <LOL>',
	execute(client, message) {
		const exampleEmbed = new Discord.MessageEmbed()
			.setColor('#0099ff')
			.setTitle('Some title')
			.setURL('https://discord.js.org/')
			.setAuthor('Some name', 'https://i.imgur.com/wSTFkRM.png', 'https://discord.js.org')
			.setDescription('Some description here')
			.setThumbnail('https://i.imgur.com/wSTFkRM.png')
			.addFields(
				{ name: 'Regular field title', value: 'Some value here' },
				{ name: '\u200B', value: '\u200B' },
				{ name: 'Inline field title', value: 'Some value here', inline: true },
				{ name: 'Inline field title', value: 'Some value here', inline: true }
			)
			.addField('Inline field title', 'Some value here', true)
			.setImage('https://i.imgur.com/wSTFkRM.png')
			.setTimestamp()
			.setFooter('Some footer text here', 'https://i.imgur.com/wSTFkRM.png');
		message.channel.send(exampleEmbed);
	}
};
