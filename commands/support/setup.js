const { CommandFailEmbed, CommandSuccessEmbed, Logger } = require('../../common/common.js');
const Log = new Logger();
const { MessageButton } = require('discord-buttons');
module.exports = {
	category: 'Support',
	name: 'ticketsetup',
	description: 'Set the chann',
	aliases: ['supportsetup'],
	guildOnly: true,
	cooldown: 5,
	minReqPermissions: ['ADMINISTRATOR'],
	maxReqPermissions: ['ADMINISTRATOR'],
	botExecutePermissions: ['MANAGE_MESSAGES', 'MENTION_EVERYONE'],
	requireArgs: false,
	usage: 'ticketsetup',
	stability: 'release',
	execute(client, message, args) {
		const setupEmbed = new Discord.MessageEmbed()
		.setColor('blue')
		.setTitle('Setting up tickets system....')
		.setDescription ('Creating ')
		if (message.guild.channels.exists('name', 'Support') && message.guild.channels.find(c => c.name == 'Support' && c.type == 'Category')) {
			
		}
	}
};
