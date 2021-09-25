/* eslint-disable no-process-env */
/* eslint-disable no-undef */
/* eslint-disable complexity */
/* eslint-disable consistent-return */
const { Logger, config, countCharOccur } = require('../common/common.js');
const Discord = require('discord.js');
const Log = new Logger();
const { prefix } = config;
Log.debug(`commandExecuter.js listening for prefix : ${prefix}`);

module.exports = {
	eventType: 'message',
	async: true,
	once: false,
	async execute(message, client) {
		function validateInputAndExecuteCommand(command, cmdName) {
			if (command.guildOnly && message.channel.type === 'dm') return message.reply('Command can only be used in a server');


			// Check user for permission to execute command
			if (message.channel.type === 'text' && !message.member.hasPermission(command.minReqPermissions)) {
				Log.verbose(`${message.author.id} did not have ${command.minReqPermissions} for ${command.name}`);
				const cmdPermissionDenied = new Discord.MessageEmbed()
					.setColor('e51d1d')
					.setTitle('Permission denied.')
					.setThumbnail('https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.mm.bing.net%2Fth%3Fid%3DOIP.5APnHUkuSyDSCTo0Je5tVQHaHi%26pid%3DApi&f=1')
					.setURL('https://dev.zejzz.net/')
					.setTimestamp();
				return message.channel.send(cmdPermissionDenied);
			}


			// Check if command is only allowed to be executed by bot managers
			if (command.botAdminOnly && parseInt(message.author.id) !== parseInt(process.env.OWNERID)) return message.reply('***Command Restricted to bot developers only.***');

			// Make sure we have the amount of arguments required
			// Count how many required arguments are needed, by counting the amount of times '<' occurs in the usage and then dividing it by 2. Since each required argument is in the format <reqArg>
			const requiredArgsAmount = countCharOccur(command.usage, '<');
			Log.verbose(`Req args of ${command.name} are ${requiredArgsAmount} out of the arg length : ${args.length}`);
			if (command.requireArgs && args.length < requiredArgsAmount) return message.reply(`Improper command usage! Missing required arguments. Correct usage: ${prefix}${command.usage}`);
			const { cooldowns } = client;

			if (!cooldowns.has(command.name)) {
				Log.verbose(`${message.author.id} has no cooldown for  ${command.name}`);
				cooldowns.set(command.name, new Discord.Collection());
				Log.verbose(`${message.author.id} set cooldown for ${command.name}`);
			}
			const now = Date.now();
			const timestamps = cooldowns.get(command.name);
			const cooldownAmount = (command.cooldown || 3) * 1000;
			if (timestamps.has(message.author.id)) {
				const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

				if (now < expirationTime) {
					const timeLeft = (expirationTime - now) / 1000;
					return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
				}
			}
			timestamps.set(message.author.id, now);
			setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);


			// Execute the command, if error then show it
			if (command.stability === 'Dangerous' || command.stability === 'Caution') {
				Log.warn(`${message.author.id} (${message.author.username}) attempted to run dangerous command ${command.name}`);
				const cmdDangerEmbed = new Discord.MessageEmbed()
					.setColor('e51d1d')
					.setTitle('Potentially destructive command')
					.setThumbnail('https://www.vkf-renzel.com/out/pictures/generated/product/1/650_650_75/r12044336-01/general-warning-sign-10836-1.jpg')
					.setURL('https://dev.zejzz.net/')
					.setDescription('This command has been flagged as being potentially dangerous to execute/reveals sensitive information. Make sure to remove/refractor this later')
					.addFields({ name: command.description, value: `Warn Level: ${command.stability}` })
					.setTimestamp();
				message.channel.send(cmdDangerEmbed);
			}
			try {
				command.execute(client, message, args);
			} catch (error) {
				console.error(error);
				message.reply('there was an error trying to execute that command!');
				Log.warn(`Error trying to execute cmdName: ${cmdName} | ${message.id} | ${message.author.id}`);
			}
		}


		if (message.channel.type === 'dm') {
			Log.verbose(`onMessage : ${message.content} ||| DirectMessage -> ${message.channel.id} -> ${message.id} <- ${message.author.id}`);
		} else {
			Log.verbose(`onMessage : ${message.content} ||| ${message.guild.id} -> ${message.channel.id} -> ${message.id} <- ${message.author.id}`);
		}
		// Bot ignores other bots, and messages without prefix
		if (!message.content.startsWith(prefix) || message.author.bot) return;
		// Cache sender (member) if not already
		if (!message.member && !message.channel.type === 'dm') {
			Log.debug(`${message.member} not cached`);
			message.member = await message.guild.fetchMember(message);
			Log.debug(`Cached user via message event : ${message.author.username}#${message.auther.discriminator} (${message.author.id}) `);
		}

		// Get args
		const args = message.content.slice(prefix.length).trim().split(/ +/);
		Log.verbose(`Args : ${args} | ${message.id}`);
		// Get command, is case insenitive

		var cmdName = args.shift().toLowerCase();
		Log.verbose(`Args : ${args} | ${message.id}`);
		Log.verbose(`cmdName: ${cmdName} | ${message.id}`);
		// If command is empty then return
		if (cmdName.length === 0) return;
		// fetch commands from command collection

		// If cmdname is a sniper
		if (cmdName === 's') {
			Log.verbose('Sniper command detected');
			cmdName = args.shift().toLowerCase();
			Log.debug(`New command ${cmdName}`);
			const command = client.snipercommands.get(cmdName);
			Log.verbose(command);
			if (!command) {
				Log.debug(`${cmdName} not found in sniper commands collection or aliases`);
				return;
			}
			validateInputAndExecuteCommand(command, cmdName);
		} else {
			const command = client.commands.get(cmdName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(cmdName));
			Log.verbose(command);
			if (!command) {
				Log.debug(`${cmdName} not found in client commands collection or aliases`);
				return;
			}
			validateInputAndExecuteCommand(command, cmdName);
		}
	}
};
