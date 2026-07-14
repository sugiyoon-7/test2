const todoInput = document.querySelector('#todo-input');
const addButton = document.querySelector('#add-button');
const todoList = document.querySelector('#todo-list');
const STORAGE_KEY = 'studentTodoAppItems';

let todos = [];

function loadTodos() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return;

  try {
    todos = JSON.parse(saved);
  } catch (error) {
    todos = [];
  }
}

function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function createTodoElement(todo) {
  const li = document.createElement('li');
  li.className = 'todo-item';
  li.dataset.id = todo.id;

  const left = document.createElement('div');
  left.className = 'todo-left';

  const label = document.createElement('label');
  label.className = `todo-label${todo.completed ? ' completed' : ''}`;

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = todo.completed;
  checkbox.addEventListener('change', () => toggleTodo(todo.id));

  const text = document.createElement('span');
  text.textContent = todo.text;

  label.appendChild(checkbox);
  label.appendChild(text);
  left.appendChild(label);
  li.appendChild(left);

  const actions = document.createElement('div');
  actions.className = 'todo-actions';

  const deleteButton = document.createElement('button');
  deleteButton.type = 'button';
  deleteButton.className = 'delete';
  deleteButton.textContent = '삭제';
  deleteButton.addEventListener('click', () => removeTodo(todo.id));

  actions.appendChild(deleteButton);
  li.appendChild(actions);

  return li;
}

function renderTodos() {
  todoList.innerHTML = '';

  if (todos.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'empty-state';
    empty.textContent = '추가된 할 일이 없습니다. 새 할 일을 입력해보세요.';
    todoList.appendChild(empty);
    return;
  }

  todos.forEach((todo) => {
    todoList.appendChild(createTodoElement(todo));
  });
}

function addTodo() {
  const text = todoInput.value.trim();
  if (text === '') {
    todoInput.focus();
    return;
  }

  todos.push({
    id: Date.now().toString(),
    text,
    completed: false,
  });

  todoInput.value = '';
  saveTodos();
  renderTodos();
}

function toggleTodo(id) {
  todos = todos.map((todo) => {
    if (todo.id !== id) return todo;
    return { ...todo, completed: !todo.completed };
  });

  saveTodos();
  renderTodos();
}

function removeTodo(id) {
  todos = todos.filter((todo) => todo.id !== id);
  saveTodos();
  renderTodos();
}

addButton.addEventListener('click', addTodo);

todoInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    addTodo();
  }
});

loadTodos();
renderTodos();
