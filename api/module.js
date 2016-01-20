var Api = function(Instagram, express, store, bodyParser, Bot) {
	var instance;

	function init() {


		var app = express();
		app.set('port', process.env.PORT || 3000);
		app.use(bodyParser());


		app.get('/getByTagName', function(req, res) {
			var tag = req.query.tag;
			Instagram.tags.recent({
				name: tag,
				complete: function(data) {
					console.log(data);
				}
			});

			var obj = {}

			res.send({
				code: 200,
				message: 'SUCCESS',
				obj: obj
			})
		});

		//Auth
		app.get('/auth', Bot.authorize);

		//Callback for auth
		app.get('/auth/callback', Bot.authorizeCallback);

		//Add Tag
		app.post('/addTag',Bot.addTag);


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