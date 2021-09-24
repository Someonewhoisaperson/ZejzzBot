/* eslint-disable no-process-env */
const { getApiInfo } = require('../../common/hypixel.js');
const { Logger } = require('../../common/common.js');
const dotenv = require('dotenv');
dotenv.config();
const Log = new Logger();
const key = process.env.HYPIXEL_API;

module.exports = {
	category: 'HYPIXELSNIPER',
	name: 'func',
	description: 'Run native function on hypixel API',
	guildOnly: true,
	cooldown: 5,
	minReqPermissions: ['SEND_MESSAGES'],
	maxReqPermissions: ['SEND_MESSAGES'],
	botExecutePermissions: ['SEND_MESSAGES'],
	requireArgs: true,
	usage: 'func <function>',
	stability: 'indev',
	execute(client, message, args) {
		if (args[0].toLowerCase().startsWith('getapiinfo')) {
			Log.debug(key);
			getApiInfo(key, (error, info) => {
				if (error) {
					console.error(error);
				}
				console.log(info);
			});
		}
	}
};
