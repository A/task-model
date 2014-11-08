'use strict';

// Dependencies
var Task = require('../models/task');
var co   = require('co');

// Tasks interface
var Tasks = module.exports = function () {};

// Add new task
Tasks.prototype.add = function * (data) {
  var task = new Task(data);
  return yield task.save.bind(task); // TODO: WTF WITH YIELDING HERE?
};

// return task by id(if number) or tag(if string or array)
Tasks.prototype.get = function * (id) {
  var q = 'number' === typeof id
    ? Task.findById(id)
    : Task.find().sort('_id');
  'string' === typeof id && q.where({ tags: id });
  return yield q.exec();
};

// update task w/ given data
Tasks.prototype.update = function * (id, data) {
  var task = yield this.get(id);
  var update = task.update.bind(task, data);
  return yield update;
};

// Remove task by cid
Tasks.prototype.remove = function * (id) {
  if ('number' !== typeof id) { return; }
  var task = yield this.get(id);
  var remove = task.remove.bind(task);
  return yield remove;
};

// Return next n tasks to do
Tasks.prototype.next = function * (n) {
  return yield this
    .find()
    .sort('start due')
    .limit(n)
    .exec()
  ;
};
