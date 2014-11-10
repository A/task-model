'use strict';

// Dependencies
var Tasks    = require('..');
var co       = require('co');
var tasks    = new Tasks();
var mongoose = require('mongoose');


// setup mongoose and clear db
before(co(function * () {
  var Task = mongoose.model('Task');
  yield Task.remove.bind(Task);
}));

describe('tasks', function() {

  describe('add()', function() {

    it('should add tasks', co(function * () {
      yield tasks.add({ name: 'first task', tags: ['inbox'] });
    }));

    it('should return task document', co(function * () {
      var task = yield tasks.add({ name: 'second task' });
      task.should.have.property('uid');
    }));

  });

  describe('get()', function() {

    it('should get all tasks', co(function * () {
      var list = yield tasks.get();
      list.length.should.equal(2);
    }));

    it('should get tasks by id', co(function * () {
      var list = yield tasks.get();
      var task = yield tasks.get(list[0].uid);
      task.should.have.property('name', 'first task');
    }));

    it('should get tasks by string with id', co(function * () {
      var list = yield tasks.get();
      var id = list[0].uid.toString();
      var task = yield tasks.get(id);
      task.should.have.property('name', 'first task');
    }));

    it('should get tasks by tag', co(function * () {
      var list = yield tasks.get('inbox');
      list[0].tags.should.have.containEql('inbox');
    }));

  });

  describe('update()', function() {

    it('should update tasks', co(function * () {
      var list = yield tasks.get();
      var id = list[0].uid;
      yield tasks.update(id, { tags: 'save the world' });
      var updated = yield tasks.get(id);
      updated.tags.should.containEql('save the world');
    }));

    it('should return task document', co(function * () {
      var list = yield tasks.get();
      var id = list[0].uid;
      var task = yield tasks.update(id, { tags: 'save the world' });
      task.should.have.property('uid');
    }));

  });

  describe('remove()', function() {

    it('should delete task', co(function * () {
      var list = yield tasks.get();
      var id = list[1].uid;
      yield tasks.remove(id);
      list = yield tasks.get();
      list.length.should.equal(1);
    }));

    it('should return task document', co(function * () {
      var list = yield tasks.get();
      var id = list[0].uid;
      var task = yield tasks.remove(id);
      task.should.have.property('uid');
    }));
  });

  describe('next()', function() {

    it('should return list of the next tasks', co(function * () {
      yield tasks.add({ name: '1', due:   +new Date() - 10000 });
      yield tasks.add({ name: '3', start: +new Date() - 20000 });
      yield tasks.add({ name: '4', start: +new Date()         });
      yield tasks.add({ name: '5', start: +new Date() + 10000 });
      yield tasks.add({ name: '2', start: +new Date() - 50000 });
      var next = yield tasks.next();
      var order = next.map(function(i) {
        return i.name;
      });
      order.should.eql(['1', '2', '3', '4']);
    }));

  });

  describe('done()', function() {

    it('should done the task', co(function * () {
      var list = yield tasks.get();
      var id = list[0].uid;
      yield tasks.done(id);
      var task = yield tasks.get(id);
      task.should.have.property('done', true);
    }));

    it('should remove task from get() results', co(function * () {
      var list = yield tasks.get();
      var id = list[0].uid;
      yield tasks.done(id);
      list = yield tasks.get();
      list = list.map(function(i) { return i.uid; });
      list.should.not.containEql(id);
    }));

    it('should remove task from next() results', co(function * () {
      var next = yield tasks.next();
      var id = next[0].uid;
      yield tasks.done(id);
      next = yield tasks.next();
      next = next.map(function(i) { return i.uid; });
      next.should.not.containEql(id);
    }));

    it('should return task document', co(function * () {
      var list = yield tasks.get();
      var id = list[0].uid;
      var task = yield tasks.done(id);
      task.should.have.property('uid');
    }));

  });

  describe('find()', function() {

    before(co(function * () {
      yield tasks.add({ name: 'foo', description: 'bar', tags: ['baz'] });
      yield tasks.add({ name: 'foo ter', description: 'beep boop', tags: ['bar', 'baz'] });
      yield tasks.add({ name: 'robot', description: 'bar roque', tags: ['fuzz']});
    }));

    it('should find tasks contains the text', co(function * () {
      var results = yield tasks.find('foo');
      results = results.map(function(i) { return i.name; });
      results.should.containEql('foo').and.containEql('foo ter');
    }));

    it('should find tasks by description', co(function * () {
      var results = yield tasks.find('bar');
      results = results.map(function(i) { return i.name; });
      results.should.containEql('foo').and.containEql('robot');
    }));

    it('should find tasks by tags', co(function * () {
      var results = yield tasks.find('baz');
      results = results.map(function(i) { return i.name; });
      results.should.containEql('foo').and.containEql('foo ter');
    }));

  });

});
