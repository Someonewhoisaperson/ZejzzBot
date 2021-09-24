const { config, Logger } = require('./common.js');
const Log = new Logger();
const https = require('https');

function getApiInfo(key, callback) {
	Log.verbose('getApiInfo');
	const apiPath = {
		hostname: 'api.hypixel.net',
		port: 443,
		path: `/key?key=${key}`,
		method: 'GET'
	};
	const req = https.request(apiPath, result => {
		console.log(`statusCode ${result.statusCode}`);
		if (result.statusCode === 403) {
			return callback(new Error('403 status code'));
		}
		result.on('data', (data) => {
			req.hdata = data;
		});
	});
	req.on('error', (err) => callback(new Error(err)));
	req.end();
	return callback(null, req.data);
}
/*
	return new Promise((resolve, reject) => {
		const req = https.request(apiPath, result => {
			console.log(`statusCode: ${result.statusCode}`);
			if (result.statusCode === 403) {
				return 403;
			}
			result.on('data', (data) => {
				process.stdout.write(data);
				return data;
			});
		});
		req.on('error', error => {
			console.error(error);
		});
		req.end();
    });
    */


exports.getApiInfo = getApiInfo;
