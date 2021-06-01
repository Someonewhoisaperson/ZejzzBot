const { Logger } = require('../../common/common.js');
const fs = require('fs');
const Log = new Logger();

module.exports = {
	category: 'BotUtils',
	name: 'reloadCommand',
	description: 'Refreshes the command without need for total bot restart',
	aliases: ['restartCommand', 'reload'],
	guildOnly: false,
	botAdminOnly: true,
	cooldown: 1,
	minReqPermissions: [' '],
	maxReqPermissions: [' '],
	botExecutePermissions: ['SEND_MESSAGES'],
	requireArgs: true,
	usage: 'reloadCommand <cmd>',
	execute(client, message, args) {
		const commandName = args[0].toLowerCase();
		Log.warn(`Attempting to reload command... ${commandName} <- ${message.id}`);
		const command = message.client.commands.get(commandName) || message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
		if (!command) {
			Log.debug(`Command ${commandName} not found to reload ${message.id}`);
			return message.channel.send(`There is no command with name or alias \`${commandName}\`, ${message.author}!`);
		}
		// Get filepath
		const commandFolders = fs.readdirSync('./commands');
		Log.debug(`Command folders: ${commandFolders}`);
		const folderName = commandFolders.find(folder => fs.readdirSync(`./commands/${folder}`).includes(`${command.name}.js`));
		Log.debug(`Folder name : ${folderName}`);

		// Delete command from cache
		delete require.cache[require.resolve(`../${folderName}/${command.name}.js`)];
		// Load new command.
		try {
			const newCommand = require(`../${folderName}/${command.name}.js`);
			// TODO: MAKE THIS PASS THROUGH THE INTEGRITY CHECKS IT HAS TO ON FIRST LOAD
			message.client.commands.set(newCommand.name, newCommand);
			Log.success(`Command reloaded ${newCommand.name} as ${command.name}`);
			return message.reply('Successfully reloaded command');
		} catch (error) {
			Log.warn(`${command.name} failed to reload...\n ${error}`);
			return message.reply(`There was an error while reloading a command \`${command.name}. Check the console for more info`);
		}
	}
};
