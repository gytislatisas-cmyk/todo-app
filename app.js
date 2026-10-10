const STORAGE_KEY = 'todos';
const THEME_KEY = 'theme';

const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');
const empty = document.getElementById('empty');
const themeToggle = document.getElementById('theme-toggle');
const clearBtn = document.getElementById('clear-completed');

let todos = load();

function load() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function render() {
  list.innerHTML = '';
  empty.hidden = todos.length > 0;
  clearBtn.hidden = !todos.some(t => t.done);

  for (const todo of todos) {
    const li = document.createElement('li');
    li.className = 'todo' + (todo.done ? ' done' : '');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = todo.done;
    checkbox.addEventListener('change', () => {
      todo.done = checkbox.checked;
      save();
      render();
    });

    const text = document.createElement('span');
    text.textContent = todo.text;

    const del = document.createElement('button');
    del.className = 'delete';
    del.textContent = '×';
    del.setAttribute('aria-label', 'Delete task');
    del.addEventListener('click', () => {
      todos = todos.filter(t => t.id !== todo.id);
      save();
      render();
    });

    li.append(checkbox, text, del);
    list.appendChild(li);
  }
}

form.addEventListener('submit', e => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  todos.push({ id: Date.now(), text, done: false });
  save();
  render();
  input.value = '';
  input.focus();
});

clearBtn.addEventListener('click', () => {
  todos = todos.filter(t => !t.done);
  save();
  render();
});

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  themeToggle.setAttribute('aria-checked', String(theme === 'dark'));
}

themeToggle.addEventListener('click', () => {
  const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  localStorage.setItem(THEME_KEY, next);
});

applyTheme(localStorage.getItem(THEME_KEY) === 'dark' ? 'dark' : 'light');
render();
