// index.js | Entrypoint

// Load sensitive environment variables
const dotenv = require('dotenv');
dotenv.config();

// Load common.js
const { InvalidConfigurationError, CommmandMissingRequiredOptionError, Logger, config } = require('./common/common.js');
const { prefix } = config;
// Initialize the Logger
const Log = new Logger();

// Verify integrity of configuration
if (config['mysql-enabled'] && config['mongodb-enabled']) throw new InvalidConfigurationError('You may only have one database enabled for use');
if (!(config['mongodb-enabled'] || config['mysql-enabled'])) throw new InvalidConfigurationError('You have not enabled support for any databases');
if (prefix.length !== 1) throw new InvalidConfigurationError('Prefix must be 1 charecter long');

// Require packages & declare instance of our client (bot)
const fs = require('fs');
const Ascii = require('ascii-table');
const Discord = require('discord.js');
const client = new Discord.Client();

// EVENT HANDLER-
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
	Log.debug(`Iterating through ${file}`)
	const event = require(`./events/${file}`);
	if (!event.eventType) throw new CommmandMissingRequiredOptionError(file, '(Event) eventType')
	if (event.once) {
		client.once(event.eventType, async (...args) => event.execute(...args, client));
		Log.success(`Registered (once) event ${file} as ${event.eventType}`)
	} else {
		client.on(event.eventType, async(...args) => event.execute(...args, client));
		Log.success(`Registered (on) event ${file} as ${event.eventType}`)
	}
}


// COMMAND HANDLER

// cooldown
client.cooldowns = new Discord.Collection();

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
Log.debug(`Config value : ${config['require-all-command-options']} | bool value : ${throwErr}`);

// Creates the base for a nice looking table
const asciiTable = new Ascii('Commands');
asciiTable.setHeading('File', 'Command', 'Category', 'Permissions', 'Load Status', 'Stability', 'Usage');
// Loops through folders
const commandFolders = fs.readdirSync('./commands');
Log.log(`List of command subdirs ${commandFolders}`);
for (const folder of commandFolders) {
	Log.debug(`Iterating through folder ${folder}`);
	const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		// Target the file we are looking
		Log.debug(`Iterating through file ${file}`);
		const command = require(`./commands/${folder}/${file}`);

		// Ensure that the command is of a proper category
		Log.debug(` ${file} category is ${command.category}`);
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
		if (command.guildOnly == null) throw new CommmandMissingRequiredOptionError(file, 'guildOnly');
		// Optional options for each command, if "throwerr" is set to true, throw a error, else set it to a pre-defiend default value.
		if (!command.cooldown) {
			if (throwErr) {
				throw new CommmandMissingRequiredOptionError(file, 'cooldown');
			}
			command.cooldown = 5;
			Log.warn(`No per user cooldown specified for command ${command.name} (${file})`);
		}

		if (!command.aliases) {
			if (throwErr) {
				throw new CommmandMissingRequiredOptionError(file, 'aliases');
			}
			command.aliases = ['None'];
			Log.warn(`No aliases specified for command ${command.name} (${file})`);
		}
		if (!command.minReqPermissions) {
			if (throwErr) {
				throw new CommmandMissingRequiredOptionError(file, 'minReqPermissions');
			}
			command.minReqPermission = ['SEND_MESSAGES'];
			Log.warn(`No minReqPermission specified for command ${command.name} (${file})`);
		}

		if (!command.maxReqPermissions) {
			if (throwErr) {
				throw new CommmandMissingRequiredOptionError(file, 'maxReqPermissions');
			}
			command.maxReqPermission = ['SEND_MESSAGES'];
			Log.warn(`No maxReqPermissons specified for command ${command.name} (${file})`);
		}
		if (!command.stability) {
			if (throwErr) {
				throw new CommmandMissingRequiredOptionError(file, 'stablility');
			}
			command.stability = 'INDEV';
			Log.warn(`No maxReqPermissons specified for command ${command.name} (${file})`);
		}

		if (!command.requireArgs) {
			if (throwErr) {
				throw new CommmandMissingRequiredOptionError(file, 'stablility');
			}
			// Check if there are option arguments defiened in usage paramater
			if (command.usage.includes('<')) { command.requireArgs = true; } else { command.requireArgs = false;}
			Log.warn(`No requireArgs specified for command ${command.name} (${file})`);
		}
		if (client.commands.has(command) || client.commands.has(command.name) || client.commands.has(cmd => cmd.aliases && cmd.aliases.includes(commandName))) { 
			Log.warn(`Failed to load command ${file}. Command with same name already exists`)
			asciiTable.addRow(file,
				command.name,
				command.category,
				`${command.minReqPermissions} || ${command.maxReqPermissions}`,
				'❌',
				command.stability,
				prefix + command.usage
			);
		} else { 
			// If everything is ok, then add it to the collection of commands and print a nice ASCII table
			client.commands.set(command.name, command);
			Log.success(`Command ${command.name} was successfully added to collection`);
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
}
// Print the ASCII asciiTable
console.log(asciiTable.toString());

// ... client setup
// eslint-disable-next-line no-process-env
client.login(process.env.TOKEN);
