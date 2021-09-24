const { Logger } = require('../../common/common.js');
const Log = new Logger();

module.exports = {
	category: 'HYPIXELSNIPER',
	name: 'denick',
	description: 'Denicks hidden player',
	guildOnly: true,
	cooldown: 15,
	minReqPermissions: ['DELETE_MESSAGES'],
	maxReqPermissions: ['ADMINISTRATOR'],
	botExecutePermissions: ['SEND_MESSAGES'],
	requireArgs: true,
	usage: 's denick <nickign>',
	stability: 'indev',
	execute(client, message) {
		Log.debug('Command hypixel sniper denick ran');
	}
};
