const ytdl = require('ytdl-core');
const {
	AudioPlayerStatus,
	StreamType,
	createAudioPlayer,
	createAudioResource,
	joinVoiceChannel,
} = require('@discordjs/voice');


const connection = joinVoiceChannel({
	channelId: voiceChannel.id,
	guildId: guild.id,
	adapterCreator: guild.voiceAdapterCreator,
});

const stream = ytdl('youtube link', { filter: 'audioonly' });
const resource = createAudioResource(stream, { inputType: StreamType.Arbitrary });
const player = createAudioPlayer();

player.play(resource);
connection.subscribe(player);

player.on(AudioPlayerStatus.Idle, () => connection.destroy());
