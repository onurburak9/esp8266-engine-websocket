var Bot = function(Instagram, store) {

	var instance;

	function init() {
		return {
			authorize: function(req, res) {
				var url = Instagram.oauth.authorization_url({
					scope: 'comments likes public_content basic', // use a space when specifying a scope; it will be encoded into a plus
					display: 'touch'
				});

				res.redirect(url);
			},
			authorizeCallback: function(req, res) {
				Instagram.oauth.ask_for_access_token({
					request: req,
					response: res,
					complete: function(params, response) {
						console.log(params['access_token']);
						console.log(params['user']);

						var query = {
							id: params['user'].id
						};

						store.findOne('user', query).then(function(user) {
							if (user)
								user.access_token = params['access_token'];
							else {
								var user = {
									username: params['user'].username,
									id: params['user'].id,
									profile_pic: params['user'].profile_picture,
									access_token: params['access_token']
								};
							}

							store.save('user', user).then(function() {
								response.send({
									code: 200,
									message: 'SUCCESS',
									user: user
								});
							});
						});



						Instagram.set('access_token', params['access_token']);


					},
					error: function(errorMessage, errorObject, caller, response) {
						// errorMessage is the raised error message
						// errorObject is either the object that caused the issue, or the nearest neighbor
						// caller is the method in which the error occurred
						console.log(errorMessage);
						console.log(errorObject);
						response.send({
							code: 200,
							message: 'SUCCESS',
							err: errorMessage,
							errObj: errorObject
						});
					}
				});
			},
			autoLike: function(req, res) {

			},
			addTag: function (req,res) {
				console.log(req.body);
			}
		};
	}
	return {
		getInstance: function() {
			if (!instance) {
				instance = init();
			}

			return instance;
		}
	}
}
module.exports = exports = Bot;