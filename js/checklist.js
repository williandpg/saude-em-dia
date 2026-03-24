const STORAGE_KEY = 'saudeEmDia_checklist';
let habits = [];

const habitsList = document.getElementById('habitsList');
const newHabitInput = document.getElementById('newHabitInput');
const addHabitBtn = document.getElementById('addHabitBtn');
const progressBar = document.getElementById('progressBar');
const progressPercent = document.getElementById('progressPercent');

function loadHabits() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    habits = JSON.parse(stored);
  } else {
    habits = [
      { id: Date.now() + 1, text: 'Estudar 1hr de Java', checked: false },
      { id: Date.now() + 2, text: 'Fazer 30 minutos de atividade física', checked: false },
      { id: Date.now() + 3, text: 'Dormir 8 horas', checked: false },
      { id: Date.now() + 4, text: 'Beber 2LT de água', checked: false }
    ];
    saveHabits();
  }
  renderHabits();
}

function saveHabits() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
}

function renderHabits() {
  if (!habitsList) return;

  if (habits.length === 0) {
    habitsList.innerHTML = '<li class="list-group-item text-muted text-center">Nenhum hábito cadastrado.</li>';
    updateProgress(0);
    return;
  }

  const sorted = [...habits].sort((a, b) => a.checked - b.checked);

  habitsList.innerHTML = sorted.map(habit => `
    <li class="list-group-item" data-id="${habit.id}">
      <div class="d-flex justify-content-between align-items-center">
        <span class="${habit.checked ? 'habit-checked' : ''}">${escapeHtml(habit.text)}</span>
        <div class="habit-actions">
          <button class="check-btn" title="${habit.checked ? 'Desmarcar' : 'Concluir'}">
            <i class="bi ${habit.checked ? 'bi-arrow-counterclockwise' : 'bi-check-circle'}"></i>
          </button>
          <button class="delete-btn" title="Remover">
            <i class="bi bi-trash"></i>
          </button>
        </div>
      </div>
    </li>
  `).join('');

  const total = habits.length;
  const completed = habits.filter(h => h.checked).length;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
  updateProgress(percent);

  document.querySelectorAll('#habitsList .list-group-item').forEach(item => {
    const id = parseInt(item.dataset.id);
    const checkBtn = item.querySelector('.check-btn');
    const deleteBtn = item.querySelector('.delete-btn');

    checkBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleHabit(id);
    });

    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      deleteHabit(id);
    });
  });
}

function toggleHabit(id) {
  const habit = habits.find(h => h.id === id);
  if (habit) {
    habit.checked = !habit.checked;
    saveHabits();
    renderHabits();
  }
}

function deleteHabit(id) {
  habits = habits.filter(h => h.id !== id);
  saveHabits();
  renderHabits();
}

function addHabit() {
  const text = newHabitInput.value.trim();
  if (text === '') {
    alert('Digite um hábito válido.');
    return;
  }

  const newHabit = {
    id: Date.now(),
    text: text,
    checked: false
  };
  habits.push(newHabit);
  saveHabits();
  renderHabits();
  newHabitInput.value = '';
  newHabitInput.focus();
}

function updateProgress(percent) {
  if (progressBar) progressBar.style.width = `${percent}%`;
  if (progressPercent) progressPercent.innerText = `${percent}%`;
}

function escapeHtml(str) {
  return str.replace(/[&<>]/g, function(m) {
    if (m === '&') return '&amp;';
    if (m === '<') return '&lt;';
    if (m === '>') return '&gt;';
    return m;
  });
}

// Event listeners
if (addHabitBtn) addHabitBtn.addEventListener('click', addHabit);
if (newHabitInput) {
  newHabitInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addHabit();
  });
}

loadHabits();
