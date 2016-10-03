var Bot = function(Instagram, store, _, Q,CronJob) {

	var instance;
	var job = new CronJob('* */2 * * *', function() {
			var currentdate = new Date();
			var datetime = "Last Sync: " + currentdate.getDate() + "/" + (currentdate.getMonth() + 1) + "/" + currentdate.getFullYear() + " @ " + currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds() +'/n';

			var query = {
				status: 'ACTIVE'
			}
			store.find('user', query).then(function(users) {
				//Call like function for each tag of user in users.
				_.each(users, function(user) {
					getContents(user);
				})
			}).fail(function(err) {
				if (error.stack) {
					console.log(error.stack);
					console.log(error.message);
				}
				console.log('FAIL SYSTEM at ' + datetime)
			});
			console.log('SUCCESS at ' + datetime);
			
		}, function() {
			console.log('\nJOB STOPPED SUCCESFULLY ! \n')
		},
		false, /* Start the job right now */
		'America/Los_Angeles' /* Time zone of this job. */

	);

		function getContents(user) { // Function for getting the recent medias for specific tag
			// var access_token = user.access_token;
			Instagram.set('access_token', '3262318851.9330f28.4e92938ed0474290a4b26f35a25943d4');
			// Instagram.set('access_token', user.access_token);

			_.each(user.tags, function(tag) {

				
				Instagram.tags.recent({
					name: tag,
					complete: function(data) {

						likeAll(data);
					}
				});
			});
		}

		function likeAll(data) { // Function for like event for given media

			for (obj in data) {
				// Instagram.media.unlike({
				// 	media_id: data[obj].id
				// });

				Instagram.media.like({
					media_id: data[obj].id
				});


			}
		}

	function init() {
		return {
			authorize: function(req, res) { // Function for authorizing
				var url = Instagram.oauth.authorization_url({
					scope: 'comments likes public_content basic', // use a space when specifying a scope; it will be encoded into a plus
					display: 'touch'
				});

				console.log(url);

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
			like: function(req, res) { // Function for auto liking for all user , PRIVATE FUNC
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
			startAutoLike: function(req,res){
				job.start();
				res.send({
					code: 200,
					message: 'SUCCESS on starting Cron Job',

				});

			},
			stopAutoLike: function(req,res){
				job.stop();
				res.send({
					code: 200,
					message: 'SUCCESS on stopping Cron Job',

				});
			},
			addTags: function(req, res) { // Function for adding tag for specific user, POST, NEED:id,tags
				var query = {
					id: req.body.id
				};
				var tags = req.body.tags;

				store.findOne('user', query).then(function(user) {
					if (user) {
						user.tags == false ? user.tags = tags : user.tags = _.union(tags, user.tags) 

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