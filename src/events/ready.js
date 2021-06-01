const { Logger } = require('../common/common.js');
const Log = new Logger();
module.exports = {
	eventType: 'ready',
	// Only triggers once
	once: true,
	execute(client) {
		Log.success(` Client logged in as ${client.user.username}#${client.user.discriminator} (${client.user.id})`);
		client.user.setActivity('Testing,....');
	}
};
