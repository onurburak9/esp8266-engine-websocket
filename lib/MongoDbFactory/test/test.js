require('rootpath')();

var expect = require('expect.js');
var path = require('path');

var mongoSkin = require('mongoskin'),
    mongoConfig = require(path.join('modules', 'Config')).getConfig();

mongoConfig.load({
  mongoAddr: process.env.MONGO_ADDR,
  mongoDb: 'seamless-' + process.env.SEAMLESS_ENV
});

describe('MongoDb', function(){

  describe('#getDb()', function(){
    it('should be a function', function(){

      var mongoDb = require(path.join('modules', 'MongoDb'))(mongoSkin, mongoConfig).getInstance();
      expect(mongoDb.getDb).to.be.a('function');

    });

    it('should return a MongoClient object', function(){

      var mongoDb = require(path.join('modules', 'MongoDb'))(mongoSkin, mongoConfig).getInstance();
      expect(mongoDb.getDb()).to.be.an('object');

    });

    it('should return a shared MongoClient object', function(){

      var mongoDb1 = require(path.join('modules', 'MongoDb'))(mongoSkin, mongoConfig).getInstance();
      var mongoDb2 = require(path.join('modules', 'MongoDb'))(mongoSkin, mongoConfig).getInstance();

      expect(mongoDb1.getDb()).to.eql(mongoDb2.getDb());
    });

  });
});
