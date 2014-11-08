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
  console.log('get');
  return yield 'number' === typeof id
    ? Task.findById(id).exec()
    : Task.find({ tag: id }).exec();
});

// Show tasks list
TaskSchema.static('list', co(function * (tag) {
  return yield this.find({tag: tag || null}).exec();
}));

// update task w/ given data
TaskSchema.static('update', co(function * (id, data) {
  var task = this.get(id);
  return yield task.update(data).exec();
}));

// Remove task by cid
TaskSchema.static('del', co(function * (id) {
  var task = this.get(id);
  return yield task.remove();
}));

// Return next n tasks to do
TaskSchema.static('next', co(function * (n) {
  return yield this
    .find()
    .sort('start due')
    .limit(n)
    .exec()
  ;
}));

var Task = module.exports = mongoose.model('Task', TaskSchema);
