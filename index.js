var Tasks = process.env.TASKS_COV
  ? require('./lib/tasks')
  : require('./lib-cov/tasks');
return new Tasks();
