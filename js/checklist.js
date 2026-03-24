const checkboxes = document.querySelectorAll('.habit-checkbox');
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');

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
}

checkboxes.forEach((checkbox) => {
  checkbox.addEventListener('change', updateProgress);
});