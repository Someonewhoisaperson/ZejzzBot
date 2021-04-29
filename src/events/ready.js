const { sendLog } = require('../errors.js');

module.exports = {
	name: 'ready',
	// Only triggers once
	once: true,
	execute(client) {
		sendLog('success', ` Client logged in as ${client.user.username}#${client.user.discriminator} (${client.user.id})`);
		client.user.setActivity('Zejzz is cool');
	}
};
