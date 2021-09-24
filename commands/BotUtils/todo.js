const todo = require('./todo.json');
module.exports = {
	category: 'BotUtils',
	name: 'todo',
	description: 'Pasding!',
	aliases: ['poasdng'],
	guildOnly: true,
	cooldown: 5,
	minReqPermissions: ['DELETE_MESSAGES'],
	maxReqPermissions: ['ADMINISTRATOR'],
	botExecutePermissions: ['SEND_MESSAGES'],
	requireArgs: false,
	usage: 'todo [add] [*args]',
	stability: 'disabled',
	botAdminOnly: true,
	execute(client, message, args) {
		if (args.length === 0) {
			return message.reply(todo.todo);
		}
		if (args.length > 1) {
			args = args.join(' ').split('/');
			todo.todo = [...args, todo.todo];
			return message.reply('Done');
		}
	}
};
