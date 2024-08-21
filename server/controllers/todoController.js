let todos = []; 
let idCounter = 1;

export const getAllTodos = (req, res) => {
  res.json(todos);
};

export const getTodoById = (req, res) => {
  const todo = todos.find(t => t.id === parseInt(req.params.id));
  if (todo) {
    res.json(todo);
  } else {
    res.status(404).json({ message: 'Todo not found' });
  }
};

export const createTodo = (req, res) => {
  const newTodo = {
    id: idCounter++,
    title: req.body.title,
    completed: req.body.completed || false,
    urgency: req.body.urgency || 'low',
    frequency: req.body.frequency || 'none',
  };
  todos.push(newTodo);
  res.status(201).json(newTodo);
};

export const updateTodo = (req, res) => {
  const todo = todos.find(t => t.id === parseInt(req.params.id));
  if (todo) {
    todo.title = req.body.title;
    todo.completed = req.body.completed;
    todo.urgency = req.body.urgency;
    todo.frequency = req.body.frequency;
    res.json(todo);
  } else {
    res.status(404).json({ message: 'Todo not found' });
  }
};

export const patchTodo = (req, res) => {
  const todo = todos.find(t => t.id === parseInt(req.params.id));
  if (todo) {
    const updatedFields = {};
    if (req.body.title) {
      todo.title = req.body.title;
      updatedFields.title = req.body.title;
    }
    if (req.body.completed !== undefined) {
      todo.completed = req.body.completed;
      updatedFields.completed = req.body.completed;
    }
    if (req.body.urgency) {
      todo.urgency = req.body.urgency;
      updatedFields.urgency = req.body.urgency;
    }
    if (req.body.frequency) {
      todo.frequency = req.body.frequency;
      updatedFields.frequency = req.body.frequency;
    }
    res.json(updatedFields);
  } else {
    res.status(404).json({ message: 'Todo not found' });
  }
};

export const deleteTodo = (req, res) => {
  const index = todos.findIndex(t => t.id === parseInt(req.params.id));
  if (index !== -1) {
    todos.splice(index, 1);
    res.json({ message: 'Todo deleted successfully' });
  } else {
    res.status(404).json({ message: 'Todo not found' });
  }
};
