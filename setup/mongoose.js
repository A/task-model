'use strict';

var mongoose = require('mongoose');
var deferred = require('deferred');
var co       = require('co');

module.exports = co(function * () {
  var def = deferred();
  mongoose.connect('localhost');
  mongoose.connection.on('open', def.resolve);
  mongoose.connection.on('error', function() {
    process.exit(1);
  });
  // mongoose.set('debug', true); // enable logging collection methods + arguments to the console
  yield def.promise;
  return mongoose;
});
