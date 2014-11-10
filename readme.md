## Task Model

[![Build Status](https://travis-ci.org/taskninja/task-model.svg)](https://travis-ci.org/taskninja/task-model)

Simply high leveled task class with mongoose backend and ES6-genetators.

## Install

```
npm install task-model
```

## API

```js
var tasks = new Tasks(options);
```

#### Task Schema

```js
var TaskSchema = new Schema({
  name: String, // task name
  description: String, // task description
  tags: [String], // list of tags (projects, contexts and other stuff)
  estimate: Number, // estimate time in ms
  created: Date, // date of creation
  due: Date, // used for tasks.next()
  start: Date // used for tasks.next()
});
```

#### tasks#*add(task)

Create the task with given task object. Return new task document;

#### tasks#*done(id)

Mark task as finished and remove it from `next()` and `get()` results.
Return task document.

#### tasks#*get()

Return all tasks.

#### tasks#*get(id)

Return task by id. `id` should be a number or string contains the number.

#### tasks#*get(tag)

Return all tasks with given tag. Tag should be a string

#### tasks#*update(id, updates)

Update the task with given data. Return updated task document.

#### tasks#*remove(id)

Remove task by id. Return removed task document.

#### tasks#*next(n)

Return next n tasks sorted by `due` and `start`.

#### tasks#model

Link to mongoose ODM model.

## Licence

MIT
