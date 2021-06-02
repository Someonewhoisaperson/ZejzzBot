/* eslint-disable complexity */
const { Logger, CommmandMissingRequiredOptionError, InvalidCommandFileError, config } = require('./common.js');
const Log = new Logger();
const throwErr = config['require-all-command-options'];
function validateCommand(command, file) {
	// Target the file we are looking
	Log.debug(`Iterating through file ${file}`);

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
	// If everything is ok, then add it to the collection of commands and print a nice ASCII table
	return true;
}


exports.validateCommand = validateCommand;
