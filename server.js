require('rootpath')();
var express = require('express'),
	expressApp = express();
httpServer = require('http').Server(expressApp),
	http = require('http'),
	io = require('socket.io')(httpServer),
	path = require('path'),
	_ = require('underscore'),
	async = require('async'),
	bodyParser = require('body-parser'),
	Q = require('q'),
	qs = require('querystring');


var app = require(path.join('api'))(express, bodyParser, path, expressApp, io, http,qs).getInstance();


httpServer.listen(app.get('port'), function() {
	console.log('Express server listening on port ', app.get('port'));
	var currentdate = new Date();
	var datetime = "Last Sync: " + currentdate.getDate() + "/" + (currentdate.getMonth() + 1) + "/" + currentdate.getFullYear() + " @ " + currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds();
	console.log(datetime);
});