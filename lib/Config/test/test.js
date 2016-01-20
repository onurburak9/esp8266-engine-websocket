var path = require('path');
var expect = require('expect.js');
var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
var should = chai.should();
chai.use(chaiAsPromised);


require('rootpath')();

var pathTestConfig = path.join('modules', 'Config', 'test', 'testConfig.json');

describe('Config', function(){

  describe('#get()', function(){
    it('should be a function', function(){

      var config = require(path.join('modules', 'Config')).getConfig();
      expect(config.get).to.be.a('function');

    });
  });

  describe('#get()', function(){
    it('should return null when no key specified', function(){

      var config = require(path.join('modules', 'Config')).getConfig();
      expect(config.get()).to.be(null);

    });
  });

  describe('#get()', function(){
    it('should return undefined when non existing config key specified', function(){

      var config = require(path.join('modules', 'Config')).getConfig();
      config.load(pathTestConfig);
      expect(config.get('testKey')).to.be(undefined);

    });
  });

  describe('#get()', function(){
    it('should return non-null when existing config key specified', function(){

      var config = require(path.join('modules', 'Config')).getConfig();
      config.load({'testKey': 'testValue'});
      expect(config.get('testKey')).to.be.ok;

    });
  });

  describe('#set()', function(){
    it('should be a function', function(){

      var config = require(path.join('modules', 'Config')).getConfig();
      expect(config.set).to.be.a('function');

    });
  });

  describe('#set()', function(){
    it('should throw error when no key specified', function(){

      var config = require(path.join('modules', 'Config')).getConfig();
      return (function(){config.set()}).should.throw();

    })
  });

  describe('#set()', function(){
    it('should throw error when specified key parameter is not a string', function(){

      var config = require(path.join('modules', 'Config')).getConfig();
      return (function(){config.set(null)}).should.throw();

    });
  });

  describe('#set()', function(){
    it('should throw error when no value specified', function(){

      var config = require(path.join('modules', 'Config')).getConfig();
      return (function(){config.set('testKey')}).should.throw();

    });
  });

  describe('#set()', function(){
    it('should return true when both key and value parameters are provided', function(){

      var config = require(path.join('modules', 'Config')).getConfig();
      return config.set('testKey', 'testValue').should.be.true;

    });
  });

  describe('#load()', function(){
    it('should be a function', function(){

      var config = require(path.join('modules', 'Config')).getConfig();
      expect(config.load).to.be.a('function');

    });
  });

  describe('#load()', function(){
    it('should expect object and return true', function(){

      var config = require(path.join('modules', 'Config')).getConfig();
      return config.load({}).should.be.true;

    });
  });

  describe('#load()', function(){
    it('should expect path string and return true', function(){

      var config = require(path.join('modules', 'Config')).getConfig();
      return config.load(pathTestConfig).should.be.true;

    });
  });

});
