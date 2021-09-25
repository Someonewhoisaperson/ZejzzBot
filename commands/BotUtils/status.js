/* eslint-disable no-process-env */
const Discord = require('discord.js');
const prettyMilliseconds = require('pretty-ms');
const { cpu } = require('node-os-utils');
const os = require('os');
const process = require('process');
const { Logger } = require('../../common/common.js');
const Log = new Logger();
const dotenv = require('dotenv');
dotenv.config();

module.exports = {
	category: 'BotUtils',
	name: 'status',
	description: 'Shows status of the bot',
	aliases: ['uptime', 'pingms'],
	guildOnly: false,
	botAdminOnly: false,
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
				var dbTime1 = Date.now();
				client.mysqlCon.query('SHOW TABLES', (err) => {
					if (err) Log.Error(err);
					var dbTimeDelta = Math.round(Date.now() - dbTime1);
					const botStatusEmbed = new Discord.MessageEmbed()
						.setColor('#0099ff')
						.setTitle('Bot Status')
						.setURL('https://dev.zejzz.net/')
						.setDescription(`Command execution time: ${Math.round(Date.now() - message.createdTimestamp)}ms\n Ping:${msg.createdTimestamp - message.createdTimestamp}ms`)
						.addFields(
							{ name: '\u200B', value: '\u200B' },
							{ name: 'Discord API Latency', value: `${Math.round(client.ws.ping)}ms`, inline: true },
							{ name: 'Hypixel API Latency', value: `${Math.round(69420)}ms`, inline: true },
							{ name: 'Reddit API Latency', value: `${Math.round(69420)}ms`, inline: true },
							{ name: '\u200B', value: '\u200B' },
							{ name: 'CPU Usage', value: `${Cpuinfo}% [${cpu.count()}]`, inline: true },
							{ name: 'Memory usage', value: `${((os.totalmem / 1000000000) - (os.freemem / 1000000000)).toFixed(2)}gb/${(os.totalmem / 1000000000).toFixed(2)}gb`, inline: true },
							{ name: 'Host Uptime', value: `${Math.round(os.uptime / 60 / 60)}h`, inline: true },
							{ name: '\u200B', value: '\u200B' },
							{ name: 'Proccess ID', value: process.pid, inline: true },
							{ name: 'Node Version', value: process.version, inline: true },
							{ name: 'Operating System', value: process.platform, inline: true },
							{ name: '\u200B', value: '\u200B' },
							{ name: 'Database Type', value: 'MySQL', inline: true },
							{ name: 'Database size:', value: 'Error..', inline: true },
							{ name: 'Database Latency', value: `${dbTimeDelta}ms`, inline: true }
						)
						.setTimestamp()
						.setFooter(`Uptime: ${prettyMilliseconds(client.uptime)} | ${process.env.ENV_TYPE} build`);
					message.channel.send(botStatusEmbed);
				});
			});
		});
	}
};
