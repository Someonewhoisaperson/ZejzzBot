const Discord = require('discord.js');
const prettyMilliseconds = require('pretty-ms');
const { cpu } = require('node-os-utils');
const os = require('os');
const process = require('process');

module.exports = {
	category: 'BotUtils',
	name: 'status',
	description: 'Shows status of the bot',
	aliases: ['uptime', 'pingms'],
	guildOnly: false,
	botAdminOnly: true,
	cooldown: 15,
	minReqPermissions: [' '],
	maxReqPermissions: [' '],
	botExecutePermissions: ['SEND_MESSAGES'],
	requireArgs: false,
	stability: 'indev',
	usage: 'status',
	execute(client, message) {
		// Create 3 embeds, one shows bot uptime, ping, api latency and downtime from discord
		// Other shows connection to database and host computer Status
		// Last one shows status of hypixel player tracker


		message.reply('Checking status...').then(async (msg) => {
			msg.delete();
			cpu.usage().then(Cpuinfo => {
				const botStatusEmbed = new Discord.MessageEmbed()
					.setColor('#0099ff')
					.setTitle('Bot Status')
					.setURL('https://dev.zejzz.net/')
					.setDescription(`Command execution time: ${Math.round(Date.now() - message.createdTimestamp) / 2}ms `)
					.addFields(
						{ name: '\u200B', value: '\u200B' },
						{ name: 'Bot Ping', value: `${msg.createdTimestamp - message.createdTimestamp}ms`, inline: true },
						{ name: 'Discord API Latency', value: `${Math.round(client.ws.ping)}ms`, inline: true },
						{ name: 'Hypixel API Latency', value: `${Math.round(412.1231)}ms`, inline: true },
						{ name: '\u200B', value: '\u200B' },
						{ name: 'CPU Usage', value: `${Cpuinfo}% [${cpu.count()}]`, inline: true },
						{ name: 'Memory usage', value: `${((os.totalmem / 1000000000) - (os.freemem / 1000000000)).toFixed(2)}gb/${(os.totalmem / 1000000000).toFixed(2)}gb`, inline: true },
						{ name: 'Host Uptime', value: `${Math.round(os.uptime / 60 / 60)}h`, inline: true },
						{ name: '\u200B', value: '\u200B' },
						{ name: 'Proccess ID', value: process.pid, inline: true },
						{ name: 'Node Version', value: process.version, inline: true },
						{ name: 'Operating System', value: process.platform, inline: true },
						{ name: '\u200B', value: '\u200B' },
						{ name: 'Database Type', value: 'Feature not added yet...', inline: true },
						{ name: 'Database size:', value: 'NotSetUpKB', inline: true },
						{ name: 'Database Latency', value: '69420ms', inline: true}
					)
					.setTimestamp()
					.setFooter(`Uptime: ${prettyMilliseconds(client.uptime)}`);
				message.channel.send(botStatusEmbed);
			});
		});
		//TODO EMBED  OUT ACTIVE COMMANDS AND STATUS
	}
};
