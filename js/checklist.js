const checkboxes = document.querySelectorAll('.habit-checkbox');
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');

const STORAGE_KEY = 'checklistHabitosSaudeEmDia';

function getInitialState() {
  const initialState = {};
  checkboxes.forEach((checkbox) => {
    initialState[checkbox.id] = false;
  });
  return initialState;
}

function saveProgress() {
  const habitsState = {};
  checkboxes.forEach((checkbox) => {
    habitsState[checkbox.id] = checkbox.checked;
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(habitsState));
}

function loadProgress() {
  const savedProgress = localStorage.getItem(STORAGE_KEY);

  if (!savedProgress) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(getInitialState()));
  }

  const habitsState = JSON.parse(localStorage.getItem(STORAGE_KEY));

  checkboxes.forEach((checkbox) => {
    if (habitsState[checkbox.id] !== undefined) {
      checkbox.checked = habitsState[checkbox.id];
    }
  });
}

function updateProgress() {
  const total = checkboxes.length;
  const checked = document.querySelectorAll('.habit-checkbox:checked').length;
  const percent = Math.round((checked / total) * 100);

  progressBar.style.width = `${percent}%`;
  progressBar.textContent = `${percent}%`;
  progressBar.setAttribute('aria-valuenow', percent);

  if (checked === 0) {
    progressText.textContent = 'Você ainda não marcou nenhum hábito.';
  } else if (checked === total) {
    progressText.textContent = 'Parabéns! Você concluiu todos os hábitos do dia.';
  } else {
    progressText.textContent = `Você concluiu ${checked} de ${total} hábitos hoje.`;
  }

  saveProgress();
}

checkboxes.forEach((checkbox) => {
  checkbox.addEventListener('change', updateProgress);
});

loadProgress();
updateProgress();