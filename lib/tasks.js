'use strict';

var Tag  = require('./models/tag');
var Task = require('./models/task');
var co   = require('co');

// Tasks interface
var Tasks = function () {};

// Add new task
Tasks.prototype.add = co(function * (data) {
  var task = new Task(data);
  return yield task.save();
});

// return task by id(if number) or tag(if string or array)
Task.prototype.get = co(function * (id) {
  return yield 'number' === typeof id
    ? Task.findById(id).exec()
    : Task.find({ tag: id }).exec();
});

// Show tasks list
Tasks.prototype.list = co(function * (tag) {
  return yield Task.find({tag: tag || null}).exec();
});

// update task w/ given data
Tasks.prototype.update = co(function * (id, data) {
  var task = this.get(id);
  return yield task.update(data).exec();
});

// Remove task by cid
Tasks.prototype.remove = co(function * (id) {
  var task = this.get(id);
  return yield task.remove();
});

// Return next n tasks to do
Tasks.prototype.next = co(function * (n) {
  return yield Task
    .find()
    .sort('start due')
    .limit(n)
    .exec()
  ;
});
