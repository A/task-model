'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// tag is the tool to aggregate the tasks to replace projects, contexts,
// and other shitty stuff
var Tag = new Schema({
  name: {
    type: String,
    required: true,
    index: true
  },
  tags: { // recousive tags
    type: [{
      type: Schema.ObjectId,
      ref: 'Tag'
    }], // list of tags (projects, contexts and other shits)
  },
});

mongoose.model('Tag', Tag);
