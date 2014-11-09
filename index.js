require('mongoose').connect('localhost');
module.exports = process.env.TASKS_COV
  ? require('./lib-cov')
  : require('./lib');
