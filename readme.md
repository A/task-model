## Task Model

Simply high leveled task class with mongoose backend and ES6-genetators.

## API

```js
var tasks = new Tasks(options);
```

#### Task Schema

```js
var TaskSchema = new Schema({
  name: String, // task name
  description: String, // task description
  tags: [String], // list of tags (projects, contexts and other shits)
  estimate: Number, // estimate time in ms
  created: Date, // date of creation
  due: Date, // used for tasks.next()
  start: Date // used for tasks.next()
});
```

#### tasks#*add(task)

Create the task with given task object. Return new task document;

#### tasks#*get()

Return all tasks.

#### tasks#*get(id)

Return task by id.

#### tasks#*get(tag)

Return all tasks with given tag.

#### tasks#*update(id, updates)

Update the task with given data. Return task document.

#### tasks#*remove(id)

Remove task by id. Return removed task document.

#### tasks#*next(n)

Return next n tasks sorted by `due` and `start`.

## Licence

MIT
