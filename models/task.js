'use strict';

var mongoose      = require('mongoose');
var Schema        = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');
var co            = require('co');
var textSearch    = require('mongoose-text-search');

autoIncrement.initialize(mongoose.connection);

var TaskSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: String, // task description
  tags: {
    type: [String] // list of tags (projects, contexts and other shits)
  },
  estimate: {
    type: Number,
    default: 0
  },
  created: {
    type: Date,
    defaults: Date.now
  },
  due: Date,
  start: Date,
  done: {
    type: Boolean,
    default: false
  }
});

// human friendly IDs
TaskSchema.plugin(autoIncrement.plugin, { model:'Task', field: 'uid' });
TaskSchema.plugin(textSearch);

// full text search indexes
TaskSchema.index({
  name: 'text',
  description: 'text',
  tags: 'text'
});

var Task = module.exports = mongoose.model('Task', TaskSchema);

Task.on('index', function (err) {
  // error occurred during index creation
  if (err) { console.error(err); }
});
