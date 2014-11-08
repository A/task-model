'use strict';

var mongoose      = require('mongoose');
var Schema        = mongoose.Schema;
var autoIncrement = require('mongodb-autoincrement');
var co            = require('co');
var thunkify      = require('thunkify');

var TaskSchema = new Schema({
  name: {
    type: String,
    required: true,
    index: true
  },
  description: String, // task description
  tags: {
    type: [String], // list of tags (projects, contexts and other shits)
    index: true
  },
  estimate: {
    type: Number,
    default: 0,
    index: true
  },
  created: {
    type: Date,
    defaults: Date.now,
    index: true
  },
  due: Date,
  start: Date
});

// human friendly IDs
TaskSchema.plugin(autoIncrement.mongoosePlugin);

// Add new task
TaskSchema.static('add', function * (data) {
  var task = new Task(data);
  return yield task.save.bind(task); // TODO: WTF WITH YIELDING HERE?
});

// return task by id(if number) or tag(if string or array)
TaskSchema.static('get', function * (id) {
  return yield 'number' === typeof id
    ? Task.findById(id).exec()
    : Task.find({ tag: id }).exec();
});

// Show tasks list
TaskSchema.static('list', co(function * (tag) {
  return yield this.find({tag: tag || null}).exec();
}));

// update task w/ given data
TaskSchema.static('updateTask', function * (id, data) {
  var task = yield Task.get(id);
  var update = thunkify(task.update.bind(task));
  return yield update(data);
});

// Remove task by cid
TaskSchema.static('del', function * (id) {
  if ('number' !== typeof id) { return; }
  var task = yield this.get(id);
  var remove = task.remove.bind(task);
  return yield remove;
});

// Return next n tasks to do
TaskSchema.static('next', function * (n) {
  return yield this
    .find()
    .sort('start due')
    .limit(n)
    .exec()
  ;
});

var Task = module.exports = mongoose.model('Task', TaskSchema);
