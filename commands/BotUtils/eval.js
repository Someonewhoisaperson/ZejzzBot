const { Logger } = require('../../common/common.js');
const Log = new Logger();

module.exports = {
	category: 'BotUtils',
	name: 'eval',
	description: 'Runs native js code',
	guildOnly: true,
	cooldown: 3,
	minReqPermissions: ['SEND_MESSAGES'],
	maxReqPermissions: ['ADMINISTRATOR'],
	botExecutePermissions: ['SEND_MESSAGES'],
	requireArgs: true,
	botAdminOnly: true,
	usage: 'eval <js>',
	stability: 'DANGEROUS',
	execute(client, message, args) {
		Log.debug('Executing command eval');
		const clean = text => {
			// eslint-disable-next-line max-statements-per-line
			if (typeof text === 'string') { return text.replace(/`/g, `\`${String.fromCharCode(8203)}`).replace(/@/g, `@${String.fromCharCode(8203)}`); } else { return text; }
		};

		try {
			const code = args.join(' ');
			let evaled = eval(code);
			if (typeof evaled !== 'string') evaled = require('util').inspect(evaled);
			message.channel.send(clean(evaled), { code: 'xl' });
		} catch (err) {
			message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
		}
	}
};
