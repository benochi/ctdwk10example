import { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/todos`);
    setTodos(response.data);
  };

  const createTodo = async () => {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/todos`, { title: newTodo });
    setTodos([...todos, response.data]);
    setNewTodo('');
  };

  const updateTodo = async (id) => {
    const response = await axios.put(`${import.meta.env.VITE_API_URL}/todos/${id}`, { title: 'Updated Todo', completed: true });
    alert(`Updated Todo:\nTitle: ${response.data.title}\nCompleted: ${response.data.completed}`);
    setTodos(todos.map(todo => todo.id === id ? response.data : todo));
  };

  const patchTodo = async (id) => {
    const response = await axios.patch(`${import.meta.env.VITE_API_URL}/todos/${id}`, { title: 'Patched Todo', completed: true });
    alert(`Patched Fields:\n${response.data.title ? `Title: ${response.data.title}` : ''}${response.data.completed !== undefined ? `\nCompleted: ${response.data.completed}` : ''}`);
    setTodos(todos.map(todo => todo.id === id ? { ...todo, ...response.data } : todo));
  };

  const deleteTodo = async (id) => {
    await axios.delete(`${import.meta.env.VITE_API_URL}/todos/${id}`);
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const testRateLimiter = async () => {
    try {
      for (let i = 0; i < 110; i++) {
        await axios.get(`${import.meta.env.VITE_API_URL}/todos`);
      }
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  return (
    <div className="app-container">
      <h1>Todo List</h1>
      <input 
        value={newTodo}
        onChange={e => setNewTodo(e.target.value)}
        placeholder="Add new todo"
      />
      <button onClick={createTodo}>Create Todo</button>
      <button onClick={testRateLimiter}>Test Rate Limiter</button>
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            {todo.title} - {todo.completed ? 'Completed' : 'Not Completed'}
            <button onClick={() => updateTodo(todo.id)}>Update</button>
            <button onClick={() => patchTodo(todo.id)}>Patch</button>
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
