const { exec } = require('child_process');


module.exports = {
	category: 'BotUtils',
	name: 'oscmd',
	description: 'Runs command on host',
	aliases: [''],
	guildOnly: true,
	cooldown: 3,
	minReqPermissions: ['DELETE_MESSAGES'],
	maxReqPermissions: ['ADMINISTRATOR'],
	botExecutePermissions: ['SEND_MESSAGES'],
	requireArgs: true,
	botAdminOnly: true,
	usage: 'oscmd <*args>',
	stability: 'Dangerous',
	execute(client, message, args) {
		exec(args.join(' '), (error, stdout, stderr) => {
			if (error) {
				console.log(`error: ${error}`);
				message.reply('Error');
				return;
			}
			if (stderr) {
				console.log(`stderr: ${stderr}`);
				message.reply('Error');
				return;
			}
			message.reply(`STDOUT: ${stdout}`);
		});
	}
};
