var Api = function(express, bodyParser,path) {
	var instance;

	function init() {


		var app = express();
		app.set('port', process.env.PORT || 3000);
		app.use(bodyParser.json()); // to support JSON-encoded bodies
		app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
			extended: true
		}));

		//-- serves static files
		app.use('/', express.static(path.join('oby')));
		app.use('/404', express.static(path.join('oby') + "/404.html"));

		app.get('/test',function (req,res) {
			console.log("TEST");
			res.send({
				code:200,
				message:'SUCCESS'
			})
		});

		app.get('*',function(req,res){
			res.status(404);
			res.redirect('/404');
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