// Load error logging/ console handler

const colors = require('colors');

colors.setTheme({
	info: 'blue',
	warn: 'yellow',
	success: 'green',
	debug: 'cyan',
	error: 'red'
});

// Error handling

class InvalidConfigurationError extends Error {

	constructor(message) {
		super(`[ERROR] Verify config file | ${message}`.error);
		this.name = 'InvalidConfigurationError';
	}

}

class InvalidCommandFileError extends Error {

	constructor(file, message) {
		super(`[ERROR] Verify command file  ${file} | ${message}`.error);
		this.name = 'InvalidCommandFileError';
	}

}

class CommmandMissingRequiredOptionError extends Error {

	constructor(file, value) {
		super(`[ERROR] Verify command file  ${file} | Missing value :  ${value}`.error);
		this.name = 'CommmandMissingRequiredOptionError';
	}

}

class InvalidArgumentError extends Error {

	constructor(message) {
		super(`[ERROR] Wrong arugment passed to function | ${message}`.error);
		this.name = 'CommmandMissingRequiredOptionError';
	}

}

function sendLog(logLevel, message) {
	logLevel = logLevel.toLowerCase();
	if (logLevel === 'debug') console.log(`[DEBUG] ${message}`.debug);
	else if (logLevel === 'info') console.log(`[INFO] ${message}`.info);
	else if (logLevel === 'warn') console.log(`[WARN] ${message}`.warn);
	else if (logLevel === 'success') console.log(`[SUCCESS] ${message}`.success);
	else throw new InvalidArgumentError('sendLog(logLevel)');
}


exports.InvalidConfigurationError = InvalidConfigurationError;
exports.InvalidCommandFileError = InvalidCommandFileError;
exports.CommmandMissingRequiredOptionError = CommmandMissingRequiredOptionError;
exports.sendLog = sendLog;
