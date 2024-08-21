import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [newUrgency, setNewUrgency] = useState('low');
  const [newFrequency, setNewFrequency] = useState('none');
  const [updateData, setUpdateData] = useState({});

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/todos`);
    setTodos(response.data);
  };

  const createTodo = async () => {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/todos`, { 
      title: newTodo,
      urgency: newUrgency,
      frequency: newFrequency,
    });
    setTodos([...todos, response.data]);
    setNewTodo('');
    setNewUrgency('low');
    setNewFrequency('none');
  };

  const updateTodo = async (id) => {
    const response = await axios.put(`${import.meta.env.VITE_API_URL}/todos/${id}`, {
      title: updateData[id]?.title || 'Default Title',
      completed: updateData[id]?.completed,
      urgency: updateData[id]?.urgency || 'low',
      frequency: updateData[id]?.frequency || 'none',
    });
    alert(`PUT Request:\nTitle: ${response.data.title}\nCompleted: ${response.data.completed}\nUrgency: ${response.data.urgency}\nFrequency: ${response.data.frequency}`);
    setTodos(todos.map(todo => todo.id === id ? response.data : todo));
  };

  const patchTodo = async (id) => {
    const patchData = {};
    const updatedFields = [];

    if (updateData[id]?.title) {
      patchData.title = updateData[id].title;
      updatedFields.push(`Title: ${patchData.title}`);
    }
    if (updateData[id]?.completed !== undefined) {
      patchData.completed = updateData[id].completed;
      updatedFields.push(`Completed: ${patchData.completed}`);
    }
    if (updateData[id]?.urgency) {
      patchData.urgency = updateData[id].urgency;
      updatedFields.push(`Urgency: ${patchData.urgency}`);
    }
    if (updateData[id]?.frequency) {
      patchData.frequency = updateData[id].frequency;
      updatedFields.push(`Frequency: ${patchData.frequency}`);
    }

    const response = await axios.patch(`${import.meta.env.VITE_API_URL}/todos/${id}`, patchData);
    alert(`PATCH Request:\n${updatedFields.join('\n')}`);
    setTodos(todos.map(todo => todo.id === id ? { ...todo, ...response.data } : todo));
  };

  const deleteTodo = async (id) => {
    await axios.delete(`${import.meta.env.VITE_API_URL}/todos/${id}`);
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const handleUpdateChange = (id, field, value) => {
    setUpdateData({
      ...updateData,
      [id]: {
        ...updateData[id],
        [field]: value,
      },
    });
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
      <div className="todo-form">
        <input 
          value={newTodo}
          onChange={e => setNewTodo(e.target.value)}
          placeholder="Add new todo"
          className="todo-input"
        />
        <select value={newUrgency} onChange={e => setNewUrgency(e.target.value)} className="todo-select">
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <select value={newFrequency} onChange={e => setNewFrequency(e.target.value)} className="todo-select">
          <option value="none">None</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
        <button onClick={createTodo} className="todo-button">Create Todo</button>
        <button onClick={testRateLimiter} className="todo-button">Test Rate Limiter</button>
      </div>

      <ul>
        {todos.map(todo => (
          <li key={todo.id} className="todo-item">
            <p><strong>{todo.title}</strong> - {todo.completed ? 'Completed' : 'Not Completed'}</p>
            <p>Urgency: {todo.urgency}</p>
            <p>Frequency: {todo.frequency}</p>
            <input
              value={updateData[todo.id]?.title || ''}
              onChange={e => handleUpdateChange(todo.id, 'title', e.target.value)}
              placeholder="Update Title"
              className="todo-input"
            />
            <label>
              Completed:
              <input
                type="checkbox"
                checked={updateData[todo.id]?.completed || false}
                onChange={e => handleUpdateChange(todo.id, 'completed', e.target.checked)}
              />
            </label>
            <select value={updateData[todo.id]?.urgency || 'low'} onChange={e => handleUpdateChange(todo.id, 'urgency', e.target.value)} className="todo-select">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <select value={updateData[todo.id]?.frequency || 'none'} onChange={e => handleUpdateChange(todo.id, 'frequency', e.target.value)} className="todo-select">
              <option value="none">None</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
            <button onClick={() => updateTodo(todo.id)} className="todo-button">PUT Update</button>
            <button onClick={() => patchTodo(todo.id)} className="todo-button">PATCH Update</button>
            <button onClick={() => deleteTodo(todo.id)} className="todo-button">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
