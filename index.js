var mongoose = require('mongoose');

mongoose.set('debug', false);
mongoose.connect('localhost/tasks_' + process.env.NODE_ENV);

module.exports = process.env.TASKS_COV
  ? require('./lib-cov')
  : require('./lib');
