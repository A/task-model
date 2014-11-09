'use strict';

// Dependencies
var Task = require('../models/task');
var co   = require('co');

// Tasks interface
var Tasks = module.exports = function () {};

// Add new task
Tasks.prototype.add = function * (data) {
  var task = new Task(data);
  return yield task.save.bind(task);
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
  id = parseInt(id);
  var task = yield this.get(id);
  if (!task) { return false; }
  var update = task.update.bind(task, data);
  return yield update;
};

// Remove task by id
Tasks.prototype.remove = function * (id) {
  if ('number' !== typeof id) { return; }
  var task = yield this.get(id);
  var remove = task.remove.bind(task);
  return yield remove;
};

// Return next n tasks to do
// TODO: Arrgegation request to get all tasks sorted by:
// - overdue
// - start
// - creation date
Tasks.prototype.next = function * (n) {
  return yield Task
    .find({$or: [
      { due: { $lt: new Date() } },
      { start: { $lt: new Date() } }
    ]})
    .sort('start due')
    .limit(n)
    .exec()
  ;
};
