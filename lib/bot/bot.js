var Bot = function(Instagram, store, _, Q) {

	var instance;

	function init() {
		return {
			authorize: function(req, res) { // Function for authorizing
				var url = Instagram.oauth.authorization_url({
					scope: 'comments likes public_content basic', // use a space when specifying a scope; it will be encoded into a plus
					display: 'touch'
				});

				res.redirect(url);
			},
			authorizeCallback: function(req, res) { // Function for callback of authorization
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
									access_token: params['access_token'],
									status: 'ACTIVE',
									tags: []
								};
							};
							store.save('user', user).then(function() {
								response.send({
									code: 200,
									message: 'SUCCESS',
									user: user
								});
							}).fail(function(err) {
								if (error.stack) {
									console.log(error.stack);
									console.log(error.message);
								}

								res.send({
									code: '500',
									message: 'FAIL_SYSTEM'
								});
							});
						});
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
			autoLike: function(req, res) { // Function for auto liking for all user , PRIVATE FUNC
				var query = {
					status: 'ACTIVE'
				}
				store.find('user', query).then(function(users) {
					//Call like function for each tag of user in users.
					_.each(users, function(obj) {
						getContents(obj);
					})
				}).fail(function(err) {
					if (error.stack) {
						console.log(error.stack);
						console.log(error.message);
					}

					res.send({
						code: '500',
						message: 'FAIL_SYSTEM'
					});
				});

				res.send({
					code: 200,
					message: 'SUCCESS',

				});
			},
			addTags: function(req, res) { // Function for adding tag for specific user, POST, NEED:id,tags
				var query = {
					id: req.body.id
				};
				var tags = req.body.tags;

				store.findOne('user', query).then(function(user) {
					if (user) {
						user.tags == false ? user.tags = _.union(tags, user.tags) : user.tags = tags

						store.save('user', user).then(function() {
							res.send({
								code: 200,
								message: 'SUCCESS',
								user: user
							});
						}).fail(function(err) {
							if (error.stack) {
								console.log(error.stack);
								console.log(error.message);
							}

							res.send({
								code: '500',
								message: 'FAIL_SYSTEM'
							});
						});
					} else {
						res.send({
							code: '401',
							message: 'USER_NOT_FOUND'
						});
					}

				}).fail(function(err) {
					if (error.stack) {
						console.log(error.stack);
						console.log(error.message);
					}

					res.send({
						code: '500',
						message: 'FAIL_SYSTEM'
					});
				});
			},
			removeTag: function(req, res) { //Function for removing tag from specific user, POST, NEED:id,tag
				var query = {
					id: req.body.id
				};
				var tag = req.body.tag;

				store.findOne('user', query).then(function(user) {
					if (user) {
						user.tags = _.union(user.tags, tag);

						store.save('user', user).then(function() {
							res.send({
								code: 200,
								message: 'SUCCESS',
								user: user
							});
						}).fail(function(err) {
							if (error.stack) {
								console.log(error.stack);
								console.log(error.message);
							}

							res.send({
								code: '500',
								message: 'FAIL_SYSTEM'
							});
						});
					} else {
						res.send({
							code: '401',
							message: 'USER_NOT_FOUND'
						});
					}

				}).fail(function(err) {
					if (error.stack) {
						console.log(error.stack);
						console.log(error.message);
					}

					res.send({
						code: '500',
						message: 'FAIL_SYSTEM'
					});
				});
			}

		};

		function getContents(user) { // Function for getting the recent medias for specific tag

			// var access_token = user.access_token;
			Instagram.set('access_token', '20581734.1fb234f.d1ee7fe4bb524aa4b2d9fda9a4372259');
			// Instagram.set('access_token', user.access_token);

			_.each(user.tags, function(tag) {
				Instagram.tags.recent({
					name: 'vsco',
					complete: function(data) {
						likeAll(data);
					}
				});
			});
		}

		function likeAll(data) { // Function for like event for given media

			for (obj in data) {
				console.log(data[obj]);

				// Instagram.media.unlike({
				// 	media_id: data[obj].id
				// });

				Instagram.media.like({
					media_id: data[obj].id
				});


			}
		}
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