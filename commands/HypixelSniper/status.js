const { Logger } = require('../../common/common.js');
const Log = new Logger();
const fetch = require('node-fetch');
module.exports = {
	category: 'HYPIXELSNIPER',
	name: 'status',
	description: 'Shows sniper status',
	guildOnly: true,
	cooldown: 15,
	minReqPermissions: ['DELETE_MESSAGES'],
	maxReqPermissions: ['ADMINISTRATOR'],
	botExecutePermissions: ['SEND_MESSAGES'],
	requireArgs: true,
	usage: 's status <U/P> <uuid/player>',
	stability: 'beta',
	execute(client, message, args) {
		const apiKey = client.env.HYPIXEL_API;
		if (args[0].lower() === 'u') {
			fetch(`https://api.hypixel.net/status?key=${apiKey}&uuid=${args[1]}`)
				.then((response) => response.json())
				.then(data => {
					console.log(data);
				})
				.catch(error => console.log('Network Error', error));
		} else if (args[0].lower() === 'p') {
			fetch(`https://api.hypixel.net/status?key=${apiKey}&name=${args[1]}`)
				.then((response) => response.json())
				.then(data => {
					console.log(data);
				})
				.catch(error => console.log('Network Error', error));
		}
	}
};
