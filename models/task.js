'use strict';

var mongoose      = require('mongoose');
var Schema        = mongoose.Schema;
var autoIncrement = require('mongodb-autoincrement');
var co            = require('co');

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

var Task = module.exports = mongoose.model('Task', TaskSchema);
