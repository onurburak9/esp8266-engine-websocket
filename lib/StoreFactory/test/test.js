var path = require('path');
var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
var should = chai.should();
var expect = chai.expect;

require('rootpath')();

var Q = require('q');
var mongoConfig = require(path.join('modules', 'Config')).getConfig();
mongoConfig.load({
  mongoAddr: process.env.MONGO_ADDR,
  mongoDb: 'seamless-' + process.env.SEAMLESS_ENV
});

var mongoSkin = require('mongoskin');
var mongoDb = require(path.join('modules', 'MongoDb'))(mongoSkin, mongoConfig).getInstance();

var mockObject = {txt:'Hello world'};
var mockObjectNonExistingId = {_id:'nonExistingId'};
var mockObjectWithId = {_id:'mockId0', txt:'Hello world'};


describe('Store', function(){

  describe('#save()', function(){

    it('should be a function', function(){

      var store = require(path.join('modules', 'Store'))(Q, mongoDb).getInstance();
      expect(store.save).to.be.a('function');

    });

    it('should be rejected with error when no collection specified', function(){

      var store = require(path.join('modules', 'Store'))(Q, mongoDb).getInstance();
      return store.save().should.be.rejectedWith(Error);

    });

    it('should be rejected with error when no object to save specified', function(){

      var store = require(path.join('modules', 'Store'))(Q, mongoDb).getInstance();
      return store.save('test').should.be.rejectedWith(Error);

    });

    it('should be rejected with error when other than type object is specified to save', function(){

      var store = require(path.join('modules', 'Store'))(Q, mongoDb).getInstance();
      return store.save('test', 'mockString').should.be.rejectedWith(Error);

    });

    it('should resolve object when collection and object to save are specified', function(){

      var store = require(path.join('modules', 'Store'))(Q, mongoDb).getInstance();
      return store.save('test', mockObjectWithId).should.eventually.be.an('object');

    });

    it('should resolve same object when collection and object with _id to save are specified', function(){

      var store = require(path.join('modules', 'Store'))(Q, mongoDb).getInstance();
      return store.save('test', mockObjectWithId).should.eventually.eql(mockObjectWithId);

    });

    it('should resolve an object with _id when collection and object without _id to save are specified', function(){

      var store = require(path.join('modules', 'Store'))(Q, mongoDb).getInstance();
      var mockObject = {txt:'Hello world'};
      return store.save('test', mockObject).should.eventually.be.ok;

    });


  });

  describe('#remove()', function(){

    it('should be a function', function(){

      var store = require(path.join('modules', 'Store'))(Q, mongoDb).getInstance();
      expect(store.remove).to.be.a('function');

    });

    it('should be rejected with error when no collection specified', function(){

      var store = require(path.join('modules', 'Store'))(Q, mongoDb).getInstance();
      return store.remove().should.be.rejectedWith(Error);

    });

    it('should be rejected with error when other than type object is specified as query', function(){

      var store = require(path.join('modules', 'Store'))(Q, mongoDb).getInstance();
      return store.remove('test', 'query').should.be.rejectedWith(Error);

    });

    it('should resolve true when collection is specified', function(){

      var store = require(path.join('modules', 'Store'))(Q, mongoDb).getInstance();
      return store.remove('test', {_id:'mockIdToDelete'}).should.eventually.eql(true);

    });

  });

  describe('#findOne()', function(){

    before(function(done){

      mongoDb.getDb().collection('testFindOne').save({_id:'mockId', name:'mock'}, function(error){

        if(error)
        {
          done(error);
          return;
        }

        done();

      });

    });

    it('should be a function', function(){

      var store = require(path.join('modules', 'Store'))(Q, mongoDb).getInstance();
      expect(store.findOne).to.be.a('function');

    });

    it('should be rejected with error when no collection specified', function(){

      var store = require(path.join('modules', 'Store'))(Q, mongoDb).getInstance();
      return store.findOne().should.be.rejectedWith(Error);

    });

    it('should be rejected with error when no query specified', function(){

      var store = require(path.join('modules', 'Store'))(Q, mongoDb).getInstance();
      return store.findOne('').should.be.rejectedWith(Error);

    });

    it('should resolve null when collection and query for nonexisting record is specified', function(){

      var store = require(path.join('modules', 'Store'))(Q, mongoDb).getInstance();
      return store.findOne('testFindOne', {_id:'mockIdNonExisting'}).should.eventually.eql(null);

    });

    it('should resolve existing object when collection and query for existing record is specified', function(){

      var store = require(path.join('modules', 'Store'))(Q, mongoDb).getInstance();
      return store.findOne('testFindOne', {_id:'mockId'}).should.become({_id:'mockId', name:'mock'});

    });

  });

  describe('#find', function(){

    before(function(done){

      var store = require(path.join('modules', 'Store'))(Q, mongoDb).getInstance();
      var op = [];
      for(var i = 0; i < 5; i++)
        op.push(store.save('testFind', {name:'mock'}));

      Q.all(op).then(function(){
        done();
      }).fail(function(error){
        done(error);
      });

    });

    after(function(done){

      var store = require(path.join('modules', 'Store'))(Q, mongoDb).getInstance();
      store.remove('testFind').then(function(){
        done();
      }).fail(function(error){
        done(error);
      });

    });

    it('should be a function', function(){
      var store = require(path.join('modules', 'Store'))(Q, mongoDb).getInstance();
      expect(store.find).to.be.a('function');
    });

    it('should be rejected with error when no collection specified', function(){

      var store = require(path.join('modules', 'Store'))(Q, mongoDb).getInstance();
      return store.find().should.be.rejectedWith(Error);

    });

    it('should be rejected with error when other than type object is specified as query', function(){

      var store = require(path.join('modules', 'Store'))(Q, mongoDb).getInstance();
      return store.find('testFind', 'query').should.be.rejectedWith(Error);

    });

    it('should resolve an array when collection is specified', function(){

      var store = require(path.join('modules', 'Store'))(Q, mongoDb).getInstance();
      return store.find('testFind').should.eventually.be.an('array');

    });

    it('should resolve an array when collection and query is specified', function(){

      var store = require(path.join('modules', 'Store'))(Q, mongoDb).getInstance();
      return store.find('testFind', {}).should.eventually.be.an('array');

    });

    it('should be rejected with error when true-evaluating options parameter other than type object is provided', function(){

      var store = require(path.join('modules', 'Store'))(Q, mongoDb).getInstance();
      return store.find('testFind', {}, 'TRUE').should.be.rejectedWith(Error);

    });

    it('should resolve an array of length equal to provided limit option', function(){

      var store = require(path.join('modules', 'Store'))(Q, mongoDb).getInstance();
      return store.find('testFind', {name:'mock'}, {skip: 0, limit: 5}).should.eventually.have.length(5);

    });

  });
});
