require('mongoose').connect('localhost/tasks');
module.exports = process.env.TASKS_COV
  ? require('./lib-cov')
  : require('./lib');
