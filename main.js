var data = {};
var qs = require('querystring');
var crypto = require('crypto');
require('http').createServer(function(req, res) {
	var respond = function(statusCode, data) {
		res.writeHead(statusCode, {'Content-Type': 'application/json', 'Connection': 'close'});
		res.end(JSON.stringify(data));
	};
	var auth = req.headers.authorization ? new Buffer(req.headers.authorization.split(' ')[1], 'base64').toString().split(':') : false;
	if (auth && !(auth[0] in data)) {
		var salt = crypto.randomBytes(16).toString('base64');
		data[auth[0]] = {password: crypto.createHash('sha256').update(auth[1] + salt).digest('hex'), salt: salt, messages:[]};
	}
	if (auth && crypto.createHash('sha256').update(auth[1] + data[auth[0]].salt).digest('hex') == data[auth[0]].password) {
		if (req.url == '/messages' && req.method == 'GET') {
			respond(200, {messages: data[auth[0]].messages});
			data[auth[0]].messages = [];
		} else if (req.url == '/messages' && req.method == 'POST') {
			req.on('data', function(chunk) {
				var postData = qs.parse(chunk.toString());
				if ('msg' in postData && 'to' in postData && postData.to in data) {
					data[postData.to].messages.push({'from': auth[0], 'msg': postData.msg});
					respond(201, {message: data[postData.to].messages[data[postData.to].messages.length - 1]});
				} else respond(409, {error: 'Invalid form data or recipient user does not exist.'});
			});
		} else respond(404, {error: 'Not Found.'});
	} else respond(403, {error: 'Incorrect username or password.'});
}).listen(8080);