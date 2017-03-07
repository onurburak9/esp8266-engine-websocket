var Api = function(express, bodyParser, path, expressApp, io,http,qs) {
	var instance;

	function init() {


		var app = expressApp;
		app.set('port', process.env.PORT || 3001);
		app.use(bodyParser.json()); // to support JSON-encoded bodies
		app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
			extended: true
		}));

		//-- serves static files
		app.use('/', express.static(path.join('public')));

		app.get('/test', function(req, res) {
			console.log("TEST");
			res.send({
				code: 200,
				message: 'SUCCESS'
			})
		});

		io.on('connection', function(client) {
			client.on('engines', function(data) {
				var left = data.left;
				var right = data.right;
				console.log(data);


			var options = {
				host: '172.20.10.6',
				path: '/controlCar?' + qs.stringify(data),

			}

				http.get(options,function(response){
					//codes going to add.
				});
			});

			client.on('disconnect', function() {});
		});

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