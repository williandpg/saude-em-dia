const STORAGE_KEY = 'checklistHabitosSaudeEmDia';

const habitosConcluidosEl = document.getElementById('habitosConcluidos');
const habitosPendentesEl = document.getElementById('habitosPendentes');
const totalHabitosEl = document.getElementById('totalHabitos');
const percentualDiaEl = document.getElementById('percentualDia');
const progressLabelEl = document.getElementById('progressLabel');
const progressBarEl = document.getElementById('progressBar');
const habitStatusListEl = document.getElementById('habitStatusList');
const motivationalMessageEl = document.getElementById('motivationalMessage');

const nomesHabitos = {
  agua: 'Bebi pelo menos 2 litros de água',
  alimentacao: 'Mantive uma alimentação equilibrada',
  sono: 'Tive uma boa noite de sono',
  'atividade-fisica': 'Pratiquei atividade física',
  pausa: 'Fiz uma pausa para relaxar',
  estresse: 'Controlei meu nível de estresse',
  gratidao: 'Pratiquei gratidão ou pensamento positivo',
  'tempo-tela': 'Reduzi o excesso de tempo em telas',
  medicacao: 'Tomei minhas medicações corretamente',
  higiene: 'Mantive meus cuidados de higiene pessoal',
  consulta: 'Organizei consultas ou exames pendentes',
  'tempo-pessoal': 'Separei um tempo para mim'
};

function carregarHabitos() {
  const dadosSalvos = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  return dadosSalvos;
}

function atualizarPainel() {
  const habitos = carregarHabitos();
  const ids = Object.keys(habitos);

  const total = ids.length;
  const concluidos = ids.filter((id) => habitos[id] === true).length;
  const pendentes = total - concluidos;
  const percentual = total > 0 ? Math.round((concluidos / total) * 100) : 0;

  habitosConcluidosEl.textContent = concluidos;
  habitosPendentesEl.textContent = pendentes;
  totalHabitosEl.textContent = total;
  percentualDiaEl.textContent = `${percentual}%`;
  progressLabelEl.textContent = `${percentual}%`;

  progressBarEl.style.width = `${percentual}%`;
  progressBarEl.textContent = `${percentual}%`;
  progressBarEl.setAttribute('aria-valuenow', percentual);

  habitStatusListEl.innerHTML = '';

  if (total === 0) {
    const item = document.createElement('li');
    item.className = 'list-group-item text-secondary';
    item.textContent = 'Nenhum hábito foi encontrado. Marque hábitos na checklist para acompanhar aqui.';
    habitStatusListEl.appendChild(item);
  } else {
    ids.forEach((id) => {
      const item = document.createElement('li');
      item.className = 'list-group-item d-flex justify-content-between align-items-center';

      const nomeHabito = nomesHabitos[id] || id;

      item.innerHTML = habitos[id]
        ? `<span class="status-done">✔ ${nomeHabito}</span><span class="badge bg-success-subtle text-success">Concluído</span>`
        : `<span class="status-pending">⏳ ${nomeHabito}</span><span class="badge bg-secondary-subtle text-secondary">Pendente</span>`;

      habitStatusListEl.appendChild(item);
    });
  }

  if (percentual === 0) {
    motivationalMessageEl.textContent = 'Você ainda não concluiu nenhum hábito hoje. Comece com pequenos passos.';
  } else if (percentual < 50) {
    motivationalMessageEl.textContent = 'Bom começo. Continue avançando na sua rotina de cuidados.';
  } else if (percentual < 100) {
    motivationalMessageEl.textContent = 'Ótimo progresso. Você está no caminho certo para um dia mais saudável.';
  } else {
    motivationalMessageEl.textContent = 'Parabéns. Você concluiu todos os hábitos do dia.';
  }
}

document.addEventListener('DOMContentLoaded', atualizarPainel);