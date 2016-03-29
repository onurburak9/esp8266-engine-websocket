var Api = function(Instagram, express, store, bodyParser, Bot) {
	var instance;

	function init() {


		var app = express();
		app.set('port', process.env.PORT || 3000);
		app.use(bodyParser.json()); // to support JSON-encoded bodies
		app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
			extended: true
		}));


		app.get('/getByTagName', function(req, res) {
			Instagram.set('access_token', '20581734.1fb234f.d1ee7fe4bb524aa4b2d9fda9a4372259');

			var tag = req.query.tag;
			Instagram.tags.recent({
				name: tag,
				complete: function(data) {

					res.send({
						code: 200,
						message: 'SUCCESS',
						obj: data
					})
				}
			});


		});

		//Auth
		app.get('/auth', Bot.authorize);
		//Callback for auth
		app.get('/auth/callback', Bot.authorizeCallback);

		//Add Tag
		app.post('/addTag', Bot.addTags);
		//Remove Tag
		app.delete('/removeTag', Bot.removeTag);

		//Like for tags that all users have
		app.get('/like', Bot.like);

		app.get('/startAutoLike',Bot.startAutoLike);
		app.get('/stopAutoLike', Bot.stopAutoLike);





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