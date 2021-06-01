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
		const cmdName = args.shift().toLowerCase();
		Log.verbose(`cmdName: ${cmdName} | ${message.id}`);
		// If command is empty then return
		if (cmdName.length === 0) return;
		// fetch commands from command collection

		if (!client.commands.has(cmdName)) Log.verbose(`${cmdName} not found in client commands collection... checking sniper commands`);
		global.commandaa = null;
		//TODO , IF SNIPER COMMAND, MOVE ARGS DOWN, AND RUN ACTUAL COMMAND, AND CHECK FOR FOLDER INSIDE FOLDER OF SNIPER COMMAND!
		if (cmdName === 's') {
			cmdName = args.shift().toLower();
		}

		if (client.snipercommands.has(cmdName)) {
			Log.verbose(`${cmdName} found in snipercommands`);
			global.commandaa = client.snipercommands.get(cmdName);
		} else {
			Log.verbose(`${cmdName} not found in snipercommands, checking aliases`);
			global.commandaa = client.commands.get(cmdName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(cmdName));
		}
		const command = global.commandaa;
		Log.debug(command.guildOnly);
		if (!command) {
			Log.debug(`${cmdName} not found in client commands collection or aliases`);
			return;
		}

		if (command.guildOnly && message.channel.type === 'dm') return message.reply('Command can only be used in a server');


		// Check user for permission to execute command
		if (message.channel.type === '' && !message.member.hasPermission(command.minReqPermissions)) {
			Log.verbose(`${message.author.id} did not have ${command.minReqPermissions} for ${command.name}`);
			return message.reply('You do not have permission to use that command');
		}

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


		if (command.botAdminOnly && !message.author.id === 717091956747927583) return message.reply('Denied.');
		// Execute the command, if error then show it
		try {
			command.execute(client, message, args);
		} catch (error) {
			console.error(error);
			message.reply('there was an error trying to execute that command!');
			Log.warn(`Error trying to execute cmdName: ${cmdName} | ${message.id} | ${message.author.id}`);
		}
	}
};
