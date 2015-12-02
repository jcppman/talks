var async = require('async');
var utils = require('./utils');
var mongodb = require('mongodb');

function forEachDoc (cursor, iterator, callback) {

    /*
     * This function will keep getting docs from the cursor and pass the doc
     * into the iterator function till the cursor exhausted
     */

    var async = require('async');
    var safeword = 'tHIS IS A sAFE WORD, sAY IT IF YoU cANT TAKE tHIS aNYMORE 81nc72j1y72734htg7aae488';
  
    async.forever(function (next) {
  
        cursor.nextObject(function (err, doc) {

            if (!doc) {
                return next(safeword); 
            }
  
            if (err) {
                return next(err);
            }        

            iterator(doc, next);

        });
    
    }, function (err) {

        if (err && err !== safeword) {

            return callback(err);
        
        }

        return callback();
    
    });

};

async.waterfall([

  // Get client
  function (next) {

    mongodb.connect('mongodb://127.0.0.1:27017/demo', function (err, client) {

      return next(err, client);
    
    });

  },

  // Clean up
  function (client, next) {

    client.collection('brands').update({},{

      $unset: { "features":"" }
    
    }, {

      multi: true
     
    }, function (err) {

      next(err, client);
    
    });
  
  },

  // Let's start
  function (client, next) {

    console.log('Generating brand features');

    // Get all the brands
    client.collection('brands').find({ /*all*/ }, {
      products: 1
    }, function (err, cur) {

      if (err) {
        return next(err);
      }

      function parseNext(doc, done) {

        // Now we have an array that contains all the products in 
        // this brand
        var products = doc.products;
        var name = doc.name;

        // Fire an aggregation on products
        client.collection('products').aggregate([

          // Find all product docs
          {
            $match: {
              _id: { $in: products}
            }
          },

          // Only keep features
          {
            $project: {
              features: 1
            } 
          },

          // unwind it, make each feature in the features a new
          // document and push it into the stream
          {
            $unwind: "$features" 
          },

          // Only keep the feature that has numeric value
          {
            $match: {
              $or: [
                {"features.value": {$type: 1}},
                {"features.value": {$type: 16}},
                {"features.value": {$type: 18}}
              ]
            } 
          },

          // Get the average value of a feature
          {
            $group: {
              _id: "$features.feature",
              value: {$avg: "$features.value"}
            }
          },

          // Rename the result
          {
            $project: {
              _id: 0,
              feature: "$_id",
              value: "$value"
            } 
          }

        ], {}, function (err, res) {

          if (err) {
            return done(err); 
          }

          console.log(res);

          client.collection('brands').update({

            _id: doc._id

          },{

            $set: {
              features: res
            }

          }, {

            upsert: true

          }, done);

        });

      }

      forEachDoc(cur, parseNext, next);

    });

  }

], function (err) {

  console.log(err ? err : 'Done');
  process.exit(0);

});
