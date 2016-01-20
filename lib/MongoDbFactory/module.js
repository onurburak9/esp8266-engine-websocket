var MongoDbFactory = function(){

  this.getDb = function (mongoSkin, mongoConfig) {
    return MongoDb(mongoSkin, mongoConfig);
  }

};

var MongoDb = function(mongoSkin, mongoConfig){

  return mongoSkin.db('mongodb://' + mongoConfig.get('mongoAddr') + '/' + mongoConfig.get('mongoDb') + '?auto_reconnect=true&replicaSet=' + (mongoConfig.get('mongoRs') ? mongoConfig.get('mongoRs') : 'true'), {w:1});

};

module.exports = exports = MongoDbFactory;
