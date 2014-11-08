'use strict';

var mongoose = require('mongoose');
var co       = require('co');

mongoose.connect('localhost');
module.exports = mongoose;
