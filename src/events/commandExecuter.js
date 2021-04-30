
const { Logger, config, countCharOccur } = require('../common/common.js');
const Log = new Logger();
const { prefix } = config;
Log.debug(`message.js listening for prefix : ${prefix}`);

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
		const cmd = args.shift().toLowerCase();
		Log.verbose(`Cmd: ${cmd} | ${message.id}`);
		// If command is empty then return
		if (cmd.length === 0) return;
		// fetch commands from command collection

		if (!client.commands.has(cmd)) {
			Log.verbose(`${cmd} not found in client commands collection`);
			return;
		}

		const command = client.commands.get(cmd)
			|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
		if (!command) return;
		
        if (command.guildOnly && message.channel.type === 'dm') return message.reply("Command can only be used in a server");
        // Make sure we have the amount of arguments required
        // Count how many required arguments are needed, by counting the amount of times '<' occurs in the usage and then dividing it by 2. Since each required argument is in the format <reqArg>
        const requiredArgsAmount =  countCharOccur(command.usage, '<');
        Log.verbose(`Req args of ${command.name} are ${requiredArgsAmount} out of the arg length : ${args.length}`)
        if (command.requireArgs && args.length < requiredArgsAmount)  return message.reply(`Improper command usage! Missing required arguments. Correct usage: ${prefix}${command.usage}`)
		
		// Cooldown handling
        const { cooldowns } = client;
        if (!cooldowns.has(command.name)) {
            cooldowns.set(command.name, new Discord.Collection());
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

        try {
			client.commands.get(cmd).execute(message, args);
		} catch (error) {
			console.error(error);
			message.reply('there was an error trying to execute that command!');
			Log.warn(`Error trying to execute cmd: ${cmd} | ${message.id} | ${message.author.id}`);
		}
	}
};
