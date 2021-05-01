const { Logger } = require('../common/common.js');
const Log = new Logger();
module.exports = {
	eventType: 'warn',
	// Only triggers once
	once: true,
	execute(info) {
		Log.warn(info);
	}
};
