require('rootpath')();
var express = require('express'),
	http = require('http'),
	path = require('path'),
	_ = require('underscore'),
	async = require('async'),
	bodyParser = require('body-parser'),
	Q = require('q');


var app = require(path.join('api'))(express, bodyParser,path).getInstance();

//Create here a cronjob that call Bot.autoLike

http.createServer(app).listen(app.get('port'), function() {
	console.log('Express server listening on port ', app.get('port'));
	var currentdate = new Date();
	var datetime = "Last Sync: " + currentdate.getDate() + "/" + (currentdate.getMonth() + 1) + "/" + currentdate.getFullYear() + " @ " + currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds();
	console.log(datetime);
});