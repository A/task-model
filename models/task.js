'use strict';

var mongoose      = require('mongoose');
var Schema        = mongoose.Schema;
var autoIncrement = require('mongodb-autoincrement');

var Task = new Schema({
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

Task.plugin(autoIncrement.mongoosePlugin);

mongoose.model('Task', Task);
