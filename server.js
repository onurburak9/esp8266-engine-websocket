require('rootpath')();
var express = require('express'),
	http = require('http'),
	path = require('path'),
	Instagram = require('instagram-node-lib'),
	_ = require('underscore'),
	async = require('async'),
	bodyParser = require('body-parser'),
	Q = require('q'),
	mongoSkin = require('mongoskin');

Instagram.set('client_id', '5c4891f0cb6f4865b818d4b40d17edde');
Instagram.set('client_secret', '8b2f847113254893a7cc13f725dfbfe7');
Instagram.set('redirect_uri', 'http://localhost:3000/auth/callback');


/*
 *	Generate instance of store
 */
var mongoConfig = require(path.join('lib', 'Config')).getConfig();
mongoConfig.load({
	mongoAddr: 'localhost:27017',
	mongoDb: 'instagram-automated',
	mongoRs: ''
});

var MongoDbFactory = require(path.join('lib', 'MongoDbFactory'));
var mongoDbFactory = new MongoDbFactory();
var mongoDb = mongoDbFactory.getDb(mongoSkin, mongoConfig);
var StoreFactory = require(path.join('lib', 'StoreFactory'));
var storeFactory = new StoreFactory();
var store = storeFactory.getStore(Q, async, _, mongoDb);

var Bot = require(path.join('lib', 'bot'))(Instagram,store).getInstance();

var app = require(path.join('api'))(Instagram,express,store,bodyParser,Bot).getInstance();

http.createServer(app).listen(app.get('port'), function() {
	console.log('Express server listening on port ', app.get('port'));
});