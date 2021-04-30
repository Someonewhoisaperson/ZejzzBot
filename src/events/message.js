/* eslint-disable no-warning-comments */
const { Logger, config } = require('../common/common.js');
const Log = new Logger();
const { prefix } = config;
Log.debug(`message.js listening for prefix : ${prefix}`);
module.exports = {
	name: 'message',
	async: true,
	once: false,
	async execute(message, client) {
		Log.verbose(`onMessage : ${message.content} ||| ${message.guild.id} -> ${message.channel.id} -> ${message.id} <- ${message.author.id}`);
		// Bot ignores dms, other bots, and messages without prefix
		if (!message.content.startsWith(prefix) || message.author.bot || !message.guild) return;
		// Cache sender (member) if not already
		if (!message.member) {
			Log.debug(`${message.member} not cached`);
			message.member = await message.guild.fetchMember(message);
			Log.debug(`Cached user via message event : ${message.author.username}#${message.auther.discriminator} (${message.author.id}) `);
		}

		// Get args
		const args = message.content.slice(prefix.length).trim().split(/ +/);
		Log.verbose(`Args : ${args} | ${message.id}`);
		// Get command, is case insenitive
		const cmd = args.shift().toLowerCase();
		Log.verbose(`Cmd: ${cmd} | ${message.id}`);
		// If command is empty then return
		if (cmd.length === 0) return;
		// fetch commands from command folder

		if (!client.commands.has(cmd)) {
			Log.verbose(`${cmd} not found in client commands collection`);
			return;
		}

		// TODO : https://discordjs.guide/command-handling/adding-features.html

		try {
			client.commands.get(cmd).execute(message, args);
		} catch (error) {
			console.error(error);
			message.reply('there was an error trying to execute that command!');
			Log.warn(`Error trying to execute cmd: ${cmd} | ${message.id} | ${message.author.id}`);
		}
	}
};
