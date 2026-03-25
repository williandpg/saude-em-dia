// ================================
// lembretes.js - Saúde em Dia
// ================================

const STORAGE_KEY = 'saudeEmDia_lembretes';

const categoriaLabels = {
    medicacao: '<i class="bi bi-capsule-pill me-1 text-success"></i> Medicação',
    consulta: '<i class="bi bi-hospital me-1 text-primary"></i> Consulta',
    exercicio: '<i class="bi bi-activity me-1 text-danger"></i> Exercício',
    hidratacao: '<i class="bi bi-droplet-fill me-1 text-info"></i> Hidratação',
    alimentacao: '<i class="bi bi-egg-fried me-1 text-warning"></i> Alimentação',
    sono: '<i class="bi bi-moon-stars-fill me-1 text-secondary"></i> Sono',
    outro: '<i class="bi bi-bookmark me-1"></i> Outro',
  };

let filtroAtivo = 'todos';

// ---------- Persistência ----------

function carregarLembretes() {
  const dados = localStorage.getItem(STORAGE_KEY);
  return dados ? JSON.parse(dados) : [];
}

function salvarLembretes(lembretes) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lembretes));
}

// ---------- Renderização ----------

function renderizarLembretes() {
  const lembretes = carregarLembretes();
  const lista = document.getElementById('lista-lembretes');
  const estadoVazio = document.getElementById('estado-vazio');

  const filtrados =
    filtroAtivo === 'todos'
      ? lembretes
      : lembretes.filter((l) => l.categoria === filtroAtivo);

  lista.innerHTML = '';

  if (filtrados.length === 0) {
    estadoVazio.classList.remove('d-none');
    return;
  }

  estadoVazio.classList.add('d-none');

  filtrados.forEach((lembrete) => {
    const col = document.createElement('div');
    col.className = 'col-md-6 col-lg-4';

    col.innerHTML = `
    <div class="lembrete-card h-100 p-4 rounded-4 shadow-sm bg-white ${lembrete.concluido ? 'concluido' : ''}">
      
      <div class="d-flex justify-content-between align-items-start mb-2">
        <span class="lembrete-categoria-badge">
          ${categoriaLabels[lembrete.categoria] || '<i class="bi bi-bookmark me-1"></i> Outro'}
        </span>
  
        ${
          lembrete.horario 
          ? `<span class="lembrete-horario">
               <i class="bi bi-clock me-1"></i> ${lembrete.horario}
             </span>` 
          : ''
        }
      </div>
  
      <p class="lembrete-titulo mb-1 mt-2">${lembrete.titulo}</p>
  
      ${
        lembrete.descricao 
        ? `<p class="lembrete-descricao mb-3">${lembrete.descricao}</p>` 
        : '<div class="mb-3"></div>'
      }
  
      <div class="d-flex gap-2 flex-wrap">
        <button
          class="btn btn-sm rounded-pill px-3 btn-concluir ${lembrete.concluido ? 'ativo' : ''}"
          data-id="${lembrete.id}"
        >
          ${
            lembrete.concluido
            ? '<i class="bi bi-check-circle-fill me-1"></i> Concluído'
            : '<i class="bi bi-check2 me-1"></i> Marcar'
          }
        </button>
  
        <button
          class="btn btn-sm rounded-pill px-3 btn-remover"
          data-id="${lembrete.id}"
        >
          <i class="bi bi-trash me-1"></i> Remover
        </button>
      </div>
  
    </div>
  `;

    lista.appendChild(col);
  });

  // Eventos dos botões dos cards
  document.querySelectorAll('.btn-concluir').forEach((btn) => {
    btn.addEventListener('click', () => alternarConcluido(btn.dataset.id));
  });

  document.querySelectorAll('.btn-remover').forEach((btn) => {
    btn.addEventListener('click', () => removerLembrete(btn.dataset.id));
  });
}

// ---------- Ações ----------

function adicionarLembrete() {
  const titulo = document.getElementById('titulo').value.trim();
  const categoria = document.getElementById('categoria').value;
  const horario = document.getElementById('horario').value;
  const descricao = document.getElementById('descricao').value.trim();

  if (!titulo) {
    document.getElementById('titulo').focus();
    mostrarToast('Informe um título para o lembrete.', false);
    return;
  }

  if (!categoria) {
    document.getElementById('categoria').focus();
    mostrarToast('Selecione uma categoria.', false);
    return;
  }

  const lembretes = carregarLembretes();

  const novoLembrete = {
    id: Date.now().toString(),
    titulo,
    categoria,
    horario,
    descricao,
    concluido: false,
  };

  lembretes.unshift(novoLembrete);
  salvarLembretes(lembretes);

  // Limpar formulário
  document.getElementById('titulo').value = '';
  document.getElementById('categoria').value = '';
  document.getElementById('horario').value = '';
  document.getElementById('descricao').value = '';

  // Resetar filtro para "todos" e re-renderizar
  filtroAtivo = 'todos';
  atualizarBotoesFiltro();
  renderizarLembretes();

  mostrarToast('Lembrete adicionado com sucesso!', true);
}

const textarea = document.getElementById('descricao');
const contadorDesc = document.getElementById('contador-descricao');

textarea.addEventListener('input', () => {
  contadorDesc.textContent = `${textarea.value.length} / 120`;
});

function alternarConcluido(id) {
  const lembretes = carregarLembretes();
  const idx = lembretes.findIndex((l) => l.id === id);
  if (idx === -1) return;

  lembretes[idx].concluido = !lembretes[idx].concluido;
  salvarLembretes(lembretes);
  renderizarLembretes();
}

function removerLembrete(id) {
  const lembretes = carregarLembretes().filter((l) => l.id !== id);
  salvarLembretes(lembretes);
  renderizarLembretes();
  mostrarToast('Lembrete removido.', true);
}

// ---------- Filtros ----------

function atualizarBotoesFiltro() {
  document.querySelectorAll('.btn-filtro').forEach((btn) => {
    const ativo = btn.dataset.filtro === filtroAtivo;
    btn.classList.toggle('active', ativo);
    btn.classList.toggle('btn-success', ativo);
    btn.classList.toggle('btn-outline-success', !ativo);
  });
}

// ---------- Toast ----------

function mostrarToast(mensagem, sucesso = true) {
  const toastEl = document.getElementById('toastLembrete');
  const toastMsg = document.getElementById('toastMensagem');

  toastEl.classList.remove('text-bg-success', 'text-bg-danger');
  toastEl.classList.add(sucesso ? 'text-bg-success' : 'text-bg-danger');

  toastMsg.textContent = mensagem;

  const toast = new bootstrap.Toast(toastEl, { delay: 3000 });
  toast.show();
}

// ---------- Init ----------

document.addEventListener('DOMContentLoaded', () => {
  renderizarLembretes();

  // Botão adicionar
  document.getElementById('btnAdicionarLembrete').addEventListener('click', adicionarLembrete);

  // Filtros
  document.getElementById('filtros').addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-filtro');
    if (!btn) return;
    filtroAtivo = btn.dataset.filtro;
    atualizarBotoesFiltro();
    renderizarLembretes();
  });
});