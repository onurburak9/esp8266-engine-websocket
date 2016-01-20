var StoreFactory = function() {

  this.getStore = function(Q, async, _, mongoDb) {
    return Store(Q, async, _, mongoDb);
  }

};

var Store = function(Q, async, _, mongoDb) {

  return {

    ensureIndex: function(collection, index) {

      mongoDb.collection(collection).ensureIndex(index, function() {});

    },

    save: function(collection, obj) {

      var deferred = Q.defer();

      if (!collection || typeof collection != 'string') {
        deferred.reject(new Error('collection not specified'));
        return deferred.promise;
      }

      if (!obj || typeof obj != 'object') {
        deferred.reject(new Error('object to save not specified'));
        return deferred.promise;
      }

      mongoDb.collection(collection).save(obj, {
        upsert: true
      }, function(error) {

        if (error) {
          deferred.reject(error);
          return deferred.promise;
        }

        deferred.resolve(obj);

      });

      return deferred.promise;

    },

    insert: function(collection, obj) {

      var deferred = Q.defer();

      if (!collection || typeof collection != 'string') {
        deferred.reject(new Error('collection not specified'));
        return deferred.promise;
      }

      if (!obj) {
        deferred.reject(new Error('object to save not specified'));
        return deferred.promise;
      }

      mongoDb.collection(collection).save(obj, function(error) {

        if (error) {
          deferred.reject(error);
          return deferred.promise;
        }

        deferred.resolve(obj);

      });

      return deferred.promise;

    },

    update: function(collection, query, obj) {

      var deferred = Q.defer();

      if (!collection || typeof collection != 'string') {
        deferred.reject(new Error('collection not specified'));
        return deferred.promise;
      }

      if (!obj || typeof obj != 'object') {
        deferred.reject(new Error('object to save not specified'));
        return deferred.promise;
      }

      mongoDb.collection(collection).update(query, obj, {
        upsert: true
      }, function(error) {

        if (error) {
          deferred.reject(error);
          return deferred.promise;
        }

        deferred.resolve(obj);

      });

      return deferred.promise;

    },

    bulkInsert: function(collection, bulkData) {

      var deferred = Q.defer();

      if (!collection || typeof collection != 'string') {
        deferred.reject(new Error('collection not specified'));
        return deferred.promise;
      }

      if (!bulkData) {
        deferred.reject(new Error('bulkData to save not specified'));
        return deferred.promise;
      }

      mongoDb.collection(collection, function(error, dbCollection) {

        if (error) {
          deferred.reject(error);
          return;
        }

        var bulkOp = dbCollection.initializeUnorderedBulkOp();

        async.each(bulkData, function(data, callback) {

          bulkOp.insert(data);
          callback();

        }, function(error) {

          if (error) {
            deferred.reject(error);
            return;
          }

          bulkOp.execute(function(error, result) {

            if (error) {
              deferred.reject(error);
              return;
            }

            deferred.resolve(result);

          });


        });

      });

      return deferred.promise;

    },

    remove: function(collection, query) {

      var deferred = Q.defer();

      if (!collection || typeof collection != 'string') {
        deferred.reject(new Error('collection not specified'));
        return deferred.promise;
      }

      if (query && typeof query != 'object') {
        deferred.reject(new Error('query not object'));
        return deferred.promise;
      } else
        query = {};

      mongoDb.collection(collection).remove(query, function(error) {
        if (error) {
          deferred.reject(error);
          return deferred.promise;
        }

        deferred.resolve(true);
      });

      return deferred.promise;

    },

    removeOne: function(collection, query) {

      var deferred = Q.defer();

      if (!collection || typeof collection != 'string') {
        deferred.reject(new Error('collection not specified'));
        return deferred.promise;
      }

      if (query && typeof query != 'object') {
        deferred.reject(new Error('query not object'));
        return deferred.promise;
      } 

      console.log(query);

        mongoDb.collection(collection).remove(query, function(error) {
          if (error) {
            deferred.reject(error);
            return deferred.promise;
          }

          deferred.resolve(true);
        });



      return deferred.promise;

    },

    findOne: function(collection, query, options) {

      var deferred = Q.defer();

      if (!collection || typeof collection != 'string') {
        deferred.reject(new Error('collection not specified'));
        return deferred.promise;
      }

      if (!query || typeof query != 'object') {
        deferred.reject(new Error('query not specified'));
        return deferred.promise;
      }

      mongoDb.collection(collection).findOne(query, function(error, result) {

        if (error) {
          deferred.reject(error);
          return deferred.promise;
        }

        deferred.resolve(result);

      });

      return deferred.promise;

    },

    find: function(collection, query, options) {

      var deferred = Q.defer();

      if (!collection || typeof collection != 'string') {
        deferred.reject(new Error('collection not specified'));
        return deferred.promise;
      }

      if (query && typeof query != 'object') {
        deferred.reject(new Error('query not object'));
        return deferred.promise;
      } else if (!query) {
        query = {};
      }

      if (options && typeof options != 'object') {
        deferred.reject(new Error('options not object'));
        return deferred.promise;
      }

      var cursor = mongoDb.collection(collection).find(query);

      if (options && options.skip && typeof options.skip == 'number')
        cursor.skip(parseInt(options.skip));

      if (options && options.limit && typeof options.limit == 'number')
        cursor.limit(parseInt(options.limit));

      if (options && options.sort && typeof options.sort == 'object')
        cursor.sort(options.sort);

      cursor.toArray(function(error, result) {

        if (error) {
          deferred.reject(error);
          return deferred.promise;
        }

        deferred.resolve(result);

      });

      return deferred.promise;

    },

    count: function(collection, query) {

      var deferred = Q.defer();

      if (!collection || typeof collection != 'string') {
        deferred.reject(new Error('collection not specified'));
        return deferred.promise;
      }

      if (query && typeof query != 'object') {
        deferred.reject(new Error('query not object'));
        return deferred.promise;
      } else if (!query) {
        query = {};
      }

      mongoDb.collection(collection).count(query, function(error, count) {
        if (error) {
          deferred.reject(error);
          return;
        }
        deferred.resolve(count);
      });

      return deferred.promise;

    },

    group: function(collection, key, addToSet) {

      var deferred = Q.defer();

      mongoDb.collection(collection).aggregate([{

        '$group': {
          '_id': key,
          'result': {
            '$addToSet': addToSet
          }
        }

      }], function(error, result) {

        if (error) {
          deferred.reject(error);
          return;
        }

        if (result.length > 0)
          deferred.resolve(result[0].result);
        else
          deferred.resolve([]);

      });

      return deferred.promise;

    }
  }

};


module.exports = exports = StoreFactory;