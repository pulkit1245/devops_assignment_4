import { useState, useEffect } from 'react'

function App() {
  const [todos, setTodos] = useState([])
  const [text, setText] = useState('')
  const [priority, setPriority] = useState('medium')
  const [category, setCategory] = useState('personal')
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    const stored = window.localStorage.getItem('todos')
    if (!stored) return

    try {
      const parsed = JSON.parse(stored)
      if (Array.isArray(parsed)) {
        setTodos(parsed)
      }
    } catch (error) {
      console.error('Failed to parse saved todos:', error)
    }
  }, [])

  const syncTodos = (nextTodos) => {
    setTodos(nextTodos)
    window.localStorage.setItem('todos', JSON.stringify(nextTodos))
  }

  const addTodo = (event) => {
    event.preventDefault()
    const trimmed = text.trim()
    if (!trimmed) return

    const nextTodos = [
      ...todos,
      {
        id: Date.now(),
        text: trimmed,
        done: false,
        priority,
        category,
        createdAt: new Date().toISOString()
      }
    ]
    syncTodos(nextTodos)
    setText('')
  }

  const toggleTodo = (id) => {
    const nextTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, done: !todo.done } : todo
    )
    syncTodos(nextTodos)
  }

  const removeTodo = (id) => {
    const nextTodos = todos.filter((todo) => todo.id !== id)
    syncTodos(nextTodos)
  }

  const filteredTodos = todos.filter(todo => {
    const matchesSearch = todo.text.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filter === 'all' ||
      (filter === 'completed' && todo.done) ||
      (filter === 'pending' && !todo.done) ||
      (filter === 'high' && todo.priority === 'high') ||
      (filter === 'medium' && todo.priority === 'medium') ||
      (filter === 'low' && todo.priority === 'low')
    return matchesSearch && matchesFilter
  })

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'var(--danger)'
      case 'medium': return 'var(--warning)'
      case 'low': return 'var(--success)'
      default: return 'var(--primary)'
    }
  }

  const getProgress = () => {
    if (todos.length === 0) return 0
    return Math.round((todos.filter(todo => todo.done).length / todos.length) * 100)
  }

  const getLastTodoText = () => {
    return todos.length > 0 ? todos[todos.length - 1].text : 'None'
  }

  return (
    <div className="app-shell">
      <header>
        <h1>Assignment 4 Task Manager</h1>
        <p>Keep your daily tasks neat, prioritized, and on track.</p>
        <div className="stats">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${getProgress()}%` }}></div>
            <span className="progress-text">{getProgress()}% Complete</span>
          </div>
          <p className="last-todo">Latest task: {getLastTodoText()}</p>
        </div>
      </header>

      <div className="search-filter">
        <input
          type="text"
          placeholder="🔍 Search tasks by keyword..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="filter-select">
          <option value="all">All Tasks</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="high">High Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="low">Low Priority</option>
        </select>
      </div>

      <form onSubmit={addTodo} className="todo-form">
        <input
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="✨ Add your next task..."
          aria-label="New todo"
        />
        <div className="todo-form-row">
          <select value={priority} onChange={(e) => setPriority(e.target.value)} className="priority-select">
            <option value="low">🟢 Low</option>
            <option value="medium">🟡 Medium</option>
            <option value="high">🔴 High</option>
          </select>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="category-select">
            <option value="personal">👤 Personal</option>
            <option value="work">💼 Work</option>
            <option value="shopping">🛒 Errands</option>
            <option value="health">🏥 Health</option>
          </select>
          <button type="submit">Add Task</button>
        </div>
      </form>

      <ul className="todo-list">
        {filteredTodos.length === 0 ? (
          <li className="empty-state">
            {searchTerm || filter !== 'all' ? 'No tasks match your search/filter.' : 'No tasks yet. Add one above! 🎉'}
          </li>
        ) : (
          filteredTodos.map((todo) => (
            <li key={todo.id} className={todo.done ? 'todo done' : 'todo'}>
              <button
                type="button"
                className="todo-toggle"
                onClick={() => toggleTodo(todo.id)}
                aria-label={`Mark ${todo.text} as ${todo.done ? 'incomplete' : 'complete'}`}
              >
                {todo.done ? '✅' : '⭕'}
              </button>
              <div className="todo-content">
                <span className="todo-text">{todo.text}</span>
                <div className="todo-meta">
                  <span className="priority-badge" style={{ backgroundColor: getPriorityColor(todo.priority) }}>
                    {todo.priority.toUpperCase()}
                  </span>
                  <span className="category-badge">{todo.category}</span>
                </div>
              </div>
              <button
                type="button"
                className="todo-remove"
                onClick={() => removeTodo(todo.id)}
                aria-label={`Remove ${todo.text}`}
              >
                🗑️
              </button>
            </li>
          ))
        )}
      </ul>

      <footer className="app-footer">
        <p>Assignment 4 project — created by Pulkit.</p>
      </footer>
    </div>
  )
}

export default App
