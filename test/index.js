'use strict';

var tasks    = require('../models/task');
var co       = require('co');
var mongoose = require('mongoose');
var Task     = mongoose.model('Task');

before(co(function * () {
  yield require('../setup/mongoose');
  yield Task.remove.bind(Task);
}));
describe('tasks', function() {
  var list;
  it('should add tasks', co(function * () {
    yield tasks.add({ name: 'first task' });
    yield tasks.add({ name: 'second task' });
    list = yield tasks.get();
    list.length.should.equal(2);
  }));
  // it('should update tasks', function() {
  //   var task = list[0];
  //   task.update({ project: 'save the world' });
  //   list = tasks.get();
  //   list[0].project.should.equal('save the world');
  // });
  // it('should delete task', function() {
  //   var task = list[1];
  //   task.del();
  //   list = tasks.get();
  //   list.length.should.equal(1);
  // });
});
