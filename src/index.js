// index.js | Entrypoint

// Load sensitive environment variables
const dotenv = require('dotenv');
dotenv.config();

// Load common.js
const { InvalidConfigurationError, CommmandMissingRequiredOptionError, InvalidCommandFileError, Logger, config, isDirectory } = require('./common/common.js');
const { validateCommand } = require('./common/commandLoader.js');
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
		connection.query('SHOW TABLES', console.log);
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

for (const folder of commandFolders) {
	Log.debug(`Iterating through folder ${folder}`);

	const rootCommandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
	const commandFiles = rootCommandFiles;
	Log.debug(client.tempvar);
	for (const file of commandFiles) {
		const command = require(`./commands/${folder}/${file}`);
		if (validateCommand(command)) {
			if (client.commands.has(command) || client.commands.has(command.name)) {
				Log.warn(`Failed to load command ${file}. Command with same name or alias already exists`);
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
				// eslint-disable-next-line max-depth
				if (command.category === 'HYPIXELSNIPER') {
					client.snipercommands.set(command.name, command);
					Log.success(`Sniper Command ${command.name} was successfully added to sniper collection`);
				} else {
					client.commands.set(command.name, command);
					Log.success(`Command ${command.name} was successfully added to collection`);
				}
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
}

// Prit the ASCII asciiTable
console.log(asciiTable.toString());

// ... client setup
// eslint-disable-next-line no-process-env
client.login(process.env.TOKEN);
