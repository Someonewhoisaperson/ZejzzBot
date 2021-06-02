const { Logger } = require('../common/common.js');
const Log = new Logger();
module.exports = {
	eventType: 'shardError',
	// Only triggers once
	once: true,
	execute(error, shardID) {
		Log.warn(` SHARDID: ${shardID} A websocket connection encountered an error: ${error}`);
	}
};
