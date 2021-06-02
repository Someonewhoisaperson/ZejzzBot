/* eslint-disable complexity */
// index.js | Entrypoint

// Load sensitive environment variables
const dotenv = require('dotenv');
dotenv.config();
const path = require('path');

// Load common.js
const { InvalidConfigurationError, CommmandMissingRequiredOptionError, InvalidCommandFileError, Logger, config } = require('./common/common.js');
const { prefix } = config;
// Initialize the Logger
const Log = new Logger();


function recursiveReadFiles(dirPath, arrayOfFiles) {
	var files = fs.readdirSync(dirPath);
	arrayOfFiles = arrayOfFiles || [];
	files.forEach((file) => {
		if (fs.statSync(`${dirPath}/${file}`).isDirectory()) {
			arrayOfFiles = recursiveReadFiles(`${dirPath}/${file}`, arrayOfFiles);
		} else {
			arrayOfFiles.push(path.join(__dirname, dirPath, '/', file));
		}
	});

	return arrayOfFiles;
}


// Verify integrity of configuration
if (config['mysql-enabled'] && config['mongodb-enabled']) throw new InvalidConfigurationError('You may only have one database enabled for use');
if (!(config['mongodb-enabled'] || config['mysql-enabled'])) throw new InvalidConfigurationError('You have not enabled support for any databases');
if (prefix.length !== 1) throw new InvalidConfigurationError('Prefix must be 1 charecter long');

// Require packages & declare instance of our client (bot)
const fs = require('fs');
const Ascii = require('ascii-table');
const Discord = require('discord.js');
const client = new Discord.Client();
client.cooldowns = new Discord.Collection();

const mysql = require('mysql');
Log.verbose(config['mysql-login'].host);
Log.verbose(process.env.MYSQL_USER);
Log.verbose(process.env.MYSQL_PASSWORD);
Log.verbose(config['mysql-login'].database);

if (config['mysql-enabled']) {
	var connection = mysql.createConnection({
		host: config['mysql-login'].host,
		user: process.env.MYSQL_USER,
		password: process.env.MYSQL_PASSWORD,
		database: config['mysql-login'].database
	});

	connection.connect(err => {
		if (err) throw err;
		Log.success(`Connected to database MYSQL ${config['mysql-login'].host}`);
		client.mysqlCon = connection;
		Log.debug('Initialized connection to client.mysqlCon');
		connection.query('SHOW TABLES', (err, rows) => {
			if (err) throw err;
			Log.verbose(rows);
		});
	});
}


// EVENT HANDLER-
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
	Log.debug(`Iterating through ${file}`);
	const event = require(`./events/${file}`);
	if (!event.eventType) throw new CommmandMissingRequiredOptionError(file, '(Event) eventType');
	if (event.once) {
		client.once(event.eventType, async (...args) => event.execute(...args, client));
		Log.success(`Registered (once) event ${file} as ${event.eventType}`);
	} else {
		client.on(event.eventType, async (...args) => event.execute(...args, client));
		Log.success(`Registered (on) event ${file} as ${event.eventType}`);
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
client.snipercommands = new Discord.Collection();
// Checks if a config value is enabled that makes the program throw errors for non-setup optional values
const throwErr = config['require-all-command-options'];
Log.debug(`Config value : ${config['require-all-command-options']} | bool value : ${throwErr}`);


// Creates the base for a nice looking table
const asciiTable = new Ascii('Commands');
asciiTable.setHeading('File', 'Command', 'Category', 'Permissions', 'Load Status', 'Stability', 'Usage');
// Loops through folders
const commandFolders = fs.readdirSync('./commands');
Log.log(`List of command subdirs ${commandFolders}`);
Log.debug('Verifying command files and loading commands....');

const commandFiles = recursiveReadFiles('./commands');
Log.verbose(commandFiles);
commandFiles.forEach(file => {
	const command = require(file);
	Log.debug(`Iterating through file ${file}`);

	// Ensure that the command is of a proper category
	Log.debug(` ${file} category is ${command.category}`);
	if (!command.category) throw new CommmandMissingRequiredOptionError(file, `category`);

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
	// eslint-disable-next-line eqeqeq
	if (command.guildOnly == null) throw new CommmandMissingRequiredOptionError(file, 'guildOnly');
	// Optional options for each command, if "throwerr" is set to true, throw a error, else set it to a pre-defiend default value.
	if (!command.cooldown) {
		if (throwErr) {
			throw new CommmandMissingRequiredOptionError(file, 'cooldown');
		}
		command.cooldown = 5;
		Log.warn(`No per user cooldown specified for command ${command.name} (${file})`);
	}
	if (command.guildOwnerOnly === null) {
		if (throwErr) {
			throw new CommmandMissingRequiredOptionError(file, 'guildOwnerOnly');
		}
		command.botAdminOnly = false;
		Log.warn(`If only server owners can use the command ${command.name} is not specified (${file})`);
	}

	if (command.botAdminOnly === null) {
		if (throwErr) {
			throw new CommmandMissingRequiredOptionError(file, 'botAdminOnly');
		}
		command.botAdminOnly = false;
		Log.warn(`If only bot admins can use the ${command.name} is not specified (${file})`);
	}

	if (!command.aliases || !command.aliases.length) {
		if (!command.category === 'HYPIXELSNIPER') {
			// eslint-disable-next-line max-depth
			if (throwErr) {
				throw new CommmandMissingRequiredOptionError(file, 'aliases');
			}
			command.aliases = [];
			Log.warn(`No aliases specified for command ${command.name} (${file})`);
		}
	}

	if (command.category === 'HYPIXELSNIPER' && command.aliases) {
		if (throwErr) {
			throw new InvalidCommandFileError(file, 'HYPIXELSNIPER commands cannot include aliases');
		}
		command.alias = null;
		Log.warn(`Command of HYPIXELSNIPER includes aliases (${command.name}) (${file})`);
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
	if (command.requireArgs === null) {
		if (throwErr) {
			throw new CommmandMissingRequiredOptionError(file, 'requireargs');
		}
		// Check if there are option arguments defiened in usage paramater
		if (command.usage.includes('<')) {
			command.requireArgs = true;
		} else {
			command.requireArgs = false;
		}
		Log.warn(`No requireArgs specified for command ${command.name} (${file}) when requireArgs are ${command.requireArgs}`);
	}
	if (client.commands.has(command) || client.commands.has(command.name)) {
		Log.warn(`Failed to load command ${file}. Command with same name or alias already exists`);
		asciiTable.addRow(readableFile,
			command.name,
			command.category,
			`${command.minReqPermissions} || ${command.maxReqPermissions}`,
			'❌',
			command.stability,
			prefix + command.usage
		);
	} else {
		var readableFile = file.split('\\');
		readableFile = readableFile[readableFile.length - 1];
		// If everything is ok, then add it to the collection of commands and print a nice ASCII table
		if (command.category === 'HYPIXELSNIPER') {
			client.snipercommands.set(command.name, command);
			Log.success(`Sniper Command ${command.name} was successfully added to sniper collection`);
		} else {
			client.commands.set(command.name, command);
			Log.success(`Command ${command.name} was successfully added to collection`);
		}
		asciiTable.addRow(readableFile,
			command.name,
			command.category,
			`${command.minReqPermissions} || ${command.maxReqPermissions}`,
			'✅',
			command.stability,
			prefix + command.usage
		);
	}
});

// Prit the ASCII asciiTable
console.log(asciiTable.toString());
// ... client setup
// eslint-disable-next-line no-process-env
client.login(process.env.TOKEN);
