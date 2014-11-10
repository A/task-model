'use strict';

// Dependencies
var Task = require('../models/task');
var co   = require('co');

// Tasks interface
var Tasks = module.exports = function () {};

// Add new task
Tasks.prototype.add = function * (data) {
  var task = new Task(data);
  var response = yield task.save.bind(task);
  return response[0];
};

// return task by id(if number) or tag(if string or array)
Tasks.prototype.get = function * (id) {
  if (id == parseInt(id)) { id = parseInt(id); }
  var q = 'number' === typeof id
    ? Task.findOne({ uid: parseInt(id) })
    : Task.find({ done: { $ne: true } }).sort('_id');
  if ('string' === typeof id) { q.where({ tags: id }); }
  return yield q.exec();
};

// search for issues contains the text
Tasks.prototype.find = function * (text) {
  var data = yield Task.textSearch.bind(Task, text);
  return data.results.map(function (i) {
    return i.obj;
  });
};

// Mark tasks as finished
Tasks.prototype.done = function * (id) {
  return yield this.update(id, { done: true });
};

// update task w/ given data
Tasks.prototype.update = function * (id, data) {
  var task = yield this.get(id);
  if (!task) { return false; }
  yield task.update.bind(task, data);
  return task;
};

// Remove task by id
Tasks.prototype.remove = function * (id) {
  if ('number' !== typeof id) { return; }
  var task = yield this.get(id);
  var remove = task.remove.bind(task);
  return yield remove;
};

// Return next n tasks to do
// TODO: Agrregation request to get all tasks sorted by:
// - overdue
// - start
// - creation date
Tasks.prototype.next = function * (n) {
  return yield Task
    .find({
      $or: [
        { due: { $lt: new Date() } },
        { start: { $lt: new Date() } }
      ],
      done: { $ne: true }
    })
    .sort('start due')
    .limit(n)
    .exec()
  ;
};
