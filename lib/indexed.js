'use strict';

var mongoose = require('mongoose');
var Task     = mongoose.model('Task');
var co       = require('co');

var resolved = false;

// wait for indexed
co(function * () {
  yield Task.once.bind(Task, 'index');
  resolved = true;
})();


module.exports = function * () {
  if (resolved) { return; }
  yield Task.once.bind(Task, 'index');
  resolved = true;
};
