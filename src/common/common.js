// Load error logging/ console handler


const config = require('../config.json');


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

class EventMissingRequiredOptionError extends Error {

	constructor(file, value) {
		super(`[ERROR] Verify EVENT FILE file ${file} | Missing value : ${value}`.error);
		this.name = 'EventMissingRequiredOptionError';
	}

}

const colors = require('colors');
colors.setTheme({
	info: 'blue',
	warn: 'yellow',
	success: 'green',
	debug: 'cyan',
	error: 'red',
	verbose: 'gray'
});


class Logger {

	constructor(logLevel = 'verbose') {
		this.setLevel(logLevel);
	}

	setLevel(logLevel) {
		switch (logLevel) {
			case 'verbose':
				this.logLevel = 3;
				break;
			case 'debug':
				this.logLevel = 2;
				break;
			case 'info':
				this.logLevel = 1;
				break;
			case 'warn':
				this.logLevel = 0;
				break;
			case 'none':
				this.logLevel = -1;
				break;
			default:
				throw new InvalidArgumentError('sendLevel(logLevel) -> Check config as well');
		}
	}

	warn(message) {
		if (this.logLevel >= 0) {
			console.log(`[WARN] ${message}`.warn);
		}
	}

	log(message) {
		if (this.logLevel >= 1) {
			console.log(`[INFO] ${message}`.info);
		}
	}

	success(message) {
		if (this.logLevel >= 1) {
			console.log(`[SUCCESS] ${message}`.success);
		}
	}


	debug(message) {
		if (this.logLevel >= 2) {
			console.log(`[DEBUG] ${message}`.debug);
		}
	}

	verbose(message) {
		if (this.logLevel >= 3) {
			console.log(`[VERBOSE] ${message}`.verbose);
		}
	}


}

function countCharOccur(str, char)
{
  // checking string is valid or not 
  if( str.length == 0 ) {
    throw new InvalidArgumentError("countOccur( str )")
  }
  let count = 0;
  //for loop to iterate over string
  for( let i = 0 ;i < str.length ;i++) { 
	if (str.charAt(i) == char) count++;

  }
  return count;
      
}
  


exports.InvalidConfigurationError = InvalidConfigurationError;
exports.InvalidCommandFileError = InvalidCommandFileError;
exports.CommmandMissingRequiredOptionError = CommmandMissingRequiredOptionError;
exports.EventMissingRequiredOptionError = EventMissingRequiredOptionError;
exports.config = config;
exports.Logger = Logger;
exports.countCharOccur = countCharOccur;