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
  it('should add tasks', co(function * () {
    var task1 = yield tasks.add({ name: 'first task', tags: ['inbox'] });
    var task2 = yield tasks.add({ name: 'second task' });
  }));
  it('should get all tasks', co(function * () {
    var list = yield tasks.get();
    list.length.should.equal(2);
  }));
  it('should get tasks by id', co(function * () {
    var list = yield tasks.get();
    var task = yield tasks.get(list[0]._id);
    task.should.have.property('name', 'first task');
  }));
  it('should get tasks by tag', co(function * () {
    var list = yield tasks.get('inbox');
    list[0].tags.should.have.containEql('inbox');
  }));
  it('should update tasks', co(function * () {
    var list = yield tasks.get();
    var id = list[0]._id;
    yield Task.updateTask(id, { tags: 'save the world' });
    var updated = yield tasks.get(id);
    updated.tags.should.containEql('save the world');
  }));
  it('should delete task', co(function * () {
    var list = yield tasks.get();
    var id = list[1]._id;
    yield Task.del(id);
    list = yield Task.get();
    list.length.should.equal(1);
  }));
});
