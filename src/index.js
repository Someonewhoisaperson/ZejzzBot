// index.js | Entrypoint


const { InvalidConfigurationError, CommmandMissingRequiredOptionError, sendLog } = require('./errors.js');


// Load sensitive environment variables
const dotenv = require('dotenv');
dotenv.config();

// Load config file
const config = require('./config.json');
const { prefix } = config;
sendLog('info', `Loaded prefix: ${prefix}`);

// Verify integrity of configuration
if (config['mysql-enabled'] && config['mongodb-enabled']) throw new InvalidConfigurationError('You may only have one database enabled for use');
if (!(config['mongodb-enabled'] || config['mysql-enabled'])) throw new InvalidConfigurationError('You have not enabled support for any databases');
if (prefix.length !== 1) throw new InvalidConfigurationError('Prefix must be 1 charecter long');

// Require packages & declare instance of our client (bot)
const fs = require('fs');
const Ascii = require('ascii-table');
const Discord = require('discord.js');
const client = new Discord.Client();

// EVENT HANDLER
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args, client));
	} else {
		client.on(event.name, (...args) => event.execute(...args, client));
	}
}


// COMMAND HANDLER

// Command options
/*
	category: '',
	name: '',
	description: '!',
	aliases: ['','',''],
	minReqPermissions: '',
    maxReqPermissions: '',
    botExecutePermissions: '',
*/

// Load commands
client.commands = new Discord.Collection();
// Checks if a config value is enabled that makes the program throw errors for non-setup optional values
const throwErr = config['require-all-command-options'];
sendLog('debug', `Config value : ${config['require-all-command-options']} | bool value : ${throwErr}`);

// Creates the base for a nice looking table
const asciiTable = new Ascii('Commands');
asciiTable.setHeading('File', 'Command', 'Category', 'Permissions', 'Load Status', 'Stability', 'Usage');
// Loops through folders
const commandFolders = fs.readdirSync('./commands');

for (const folder of commandFolders) {
	sendLog('debug', `Iterating through folder ${folder}`);
	const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
	sendLog('info', `List of command subdirs ${commandFolders}`);
	for (const file of commandFiles) {
		// Target the file we are looking
		sendLog('debug', `Iterating through file ${file}`);
		const command = require(`./commands/${folder}/${file}`);

		// Ensure that the command is of a proper category
		sendLog('debug', ` ${file} category is ${command.category}`);
		if (!command.category) throw new CommmandMissingRequiredOptionError(file, 'category');

		// TODO: FIX THIS ! COMPARISION IS NOT WORKING
		/*
		if (!(command.category in commandFolders.toString)) {
			throw new InvalidCommandFileError(file, 'Category set to non-existent subdirectory');
		}
        */

		// Ensure that all the options are set properly, if mandatory ones are not defiend, throw error
		if (!command.name) throw new CommmandMissingRequiredOptionError(file, 'name');
		if (!command.description) throw new CommmandMissingRequiredOptionError(file, 'description');
		if (!command.botExecutePermissions) throw new CommmandMissingRequiredOptionError(file, 'botExecutePermissions');
		if (!command.usage) throw new CommmandMissingRequiredOptionError(file, 'usage');

		// Optional options for each command, if "throwerr" is set to true, throw a error, else set it to a pre-defiend default value.
		if (!command.aliases) {
			if (throwErr) {
				throw new CommmandMissingRequiredOptionError(file, 'aliases');
			}
			command.aliases = ['None'];
			sendLog('warn', `No aliases specified for command ${command.name} (${file})`);
		}
		if (!command.minReqPermissions) {
			if (throwErr) {
				throw new CommmandMissingRequiredOptionError(file, 'minReqPermissions');
			}
			command.minReqPermission = ['SEND_MESSAGES'];
			sendLog('warn', `No minReqPermission specified for command ${command.name} (${file})`);
		}

		if (!command.maxReqPermissions) {
			if (throwErr) {
				throw new CommmandMissingRequiredOptionError(file, 'maxReqPermissions');
			}
			command.maxReqPermission = ['SEND_MESSAGES'];
			sendLog('warn', `No maxReqPermissons specified for command ${command.name} (${file})`);
		}
		if (!command.stability) {
			if (throwErr) {
				throw new CommmandMissingRequiredOptionError(file, 'stablility');
			}
			command.stability = 'INDEV';
			sendLog('warn', `No maxReqPermissons specified for command ${command.name} (${file})`);
		}

		if (!command.requireArgs) {
			if (throwErr) {
				throw new CommmandMissingRequiredOptionError(file, 'stablility');
			}
			// Check if there are option arguments defiened in usage param
			if (command.usage.includes('<')) { command.requireArgs = false; }
			sendLog('warn', `No requireArgs specified for command ${command.name} (${file})`);
		}
		// If everything is ok, then add it to the collection of commands and print a nice ASCII table
		client.commands.set(command.name, command);

		// Make a nice table

		asciiTable.addRow(file,
			command.name,
			command.category,
			`${command.minReqPermissions} || ${command.maxReqPermissions}`,
			'✅',
			command.stability,
			prefix + command.usage
		);
	}
}
// Print the ASCII asciiTable
console.log(asciiTable.toString());


// Executes every time a message is sent somewhere where the client has read permissions
client.on('message', async message => {
	// Bot ignores dms, other bots, and messages without prefix
	if (!message.content.startsWith(prefix) || message.author.bot || !message.guild) return;

	// Cache sender (member) if not already
	if (!message.member) message.member = await message.guild.fetchMember(message);

	// Get args
	const args = message.content.slice(prefix.length).trim().split(/ +/);

	// Get command, is case insenitive
	const cmd = args.shift().toLowerCase();

	// If command is empty then return
	if (cmd.length === 0) return;

	// fetch commands from command folder

	if (!client.commands.has(cmd)) return;

	// TODO : https://discordjs.guide/command-handling/adding-features.html

	try {
		client.commands.get(cmd).execute(message, args);
	} catch (error) {
		console.error(error);
		message.reply('there was an error trying to execute that command!');
	}
});

// ... client setup
// eslint-disable-next-line no-process-env
client.login(process.env.TOKEN);
