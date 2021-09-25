/* eslint-disable new-cap */
const { CommandFailEmbed, CommandSuccessEmbed, Logger } = require('../../common/common.js');
const Log = new Logger();
const ytdl = require('ytdl-core');
const {
	AudioPlayerStatus,
	StreamType,
	createAudioPlayer,
	createAudioResource,
	joinVoiceChannel
} = require('@discordjs/voice');

module.exports = {
	category: 'Music',
	name: 'play',
	description: 'Plays music in voice channel',
	aliases: ['music', 'sing'],
	guildOnly: true,
	cooldown: 15,
	minReqPermissions: ['SEND_MESSAGES'],
	maxReqPermissions: ['SEND_MESSAGES'],
	botExecutePermissions: ['SPEAK'],
	requireArgs: true,
	usage: '.play <ytlink>',
	stability: 'beta',
	execute(client, message, args) {
};
