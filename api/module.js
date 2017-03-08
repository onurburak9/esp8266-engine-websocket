var Api = function(express, bodyParser, path, expressApp, io, http, qs, WebSocketServer, httpServer) {
	var instance;

	function init() {


		var app = expressApp;
		app.set('port', process.env.PORT || 3001);
		app.use(bodyParser.json()); // to support JSON-encoded bodies
		app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
			extended: true
		}));
		var left=0
		var right = 0

		//-- serves static files
		app.use('/', express.static(path.join('public')));

		app.get('/test', function(req, res) {
			console.log("TEST");
			res.send({
				code: 200,
				message: 'SUCCESS'
			})
		});
		app.get('/reset', function(req, res) {
			left = 0;
			right = 0;
		});
		app.get('/getValues', function(req, res) {
			console.log("get value request");
			res.send({
				left: left,
				right: right
			});
		});
		wsServer = new WebSocketServer({
			httpServer: httpServer,
			autoAcceptConnections: false
		});

		wsServer.on('request', function(request) {
			var connection = request.accept('', request.origin);
			console.log((new Date()) + ' Connection accepted.');
			
			connection.on('getValue')
			connection.on('close', function(reasonCode, description) {
				console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
			});
		});

		// io.on('connection', function(client) {
		// 	client.on('engines', function(data) {
		// 		left = data.left;
		// 		right = data.right;
		// 		console.log(data);
		// 	});
		// 	client.on('getValues', function() {

		// 	})

		// 	client.on('disconnect', function() {
		// 		console.log("Client disconnected");
		// 	});
		// });

		return app;
	}


	return {
		getInstance: function() {
			if (!instance)
				instance = init();

			return instance;
		}
	}
}

module.exports = exports = Api;