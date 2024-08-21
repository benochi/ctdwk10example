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
    text: req.body.text,
    completed: req.body.completed || false,
  };
  todos.push(newTodo);
  res.status(201).json(newTodo);
};

export const updateTodo = (req, res) => {
  const todo = todos.find(t => t.id === parseInt(req.params.id));
  if (todo) {
    todo.text = req.body.text;
    todo.completed = req.body.completed;
    res.json(todo);
  } else {
    res.status(404).json({ message: 'Todo not found' });
  }
};

export const patchTodo = (req, res) => {
  const todo = todos.find(t => t.id === parseInt(req.params.id));
  if (todo) {
    if (req.body.text) {
      todo.text = req.body.text;
    }
    if (req.body.completed !== undefined) {
      todo.completed = req.body.completed;
    }
    res.json(todo);
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
