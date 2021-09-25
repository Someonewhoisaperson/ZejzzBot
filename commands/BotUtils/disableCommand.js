const { Logger } = require('../../common/common.js');
const Log = new Logger();
const fs = require('fs');


module.exports = {
	category: 'BotUtils',
	name: 'disableCommand',
	description: 'Disables the specified command without need for total bot restart',
	aliases: ['disableCommand', 'disablecmd'],
	guildOnly: false,
	botAdminOnly: true,
	cooldown: 1,
	minReqPermissions: [' '],
	maxReqPermissions: [' '],
	botExecutePermissions: ['SEND_MESSAGES'],
	requireArgs: true,
	usage: 'disableCommand <cmd>',
	stability: 'Caution',
	execute(client, message, args) {
		const commandName = args[0].toLowerCase();
		Log.warn(`Attempting to disable command... ${commandName} <- ${message.id}`);
		const command = message.client.commands.get(commandName) || message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
		if (!command) {
			Log.debug(`Command ${commandName} not found to disable ${message.id}`);
			return message.channel.send(`There is no command with name or alias \`${commandName}\`, ${message.author}!`);
		}
		// Get filepath
		const commandFolders = fs.readdirSync('./commands');
		Log.debug(`Command folders: ${commandFolders}`);
		const folderName = commandFolders.find(folder => fs.readdirSync(`./commands/${folder}`).includes(`${command.name}.js`));
		Log.debug(`Folder name : ${folderName}`);

		// Delete command from cache
		delete require.cache[require.resolve(`../${folderName}/${command.name}.js`)];
		Log.success(`Command disabled ${command.name}`);
		return message.reply('Successfully reloaded command');
	}
};
