/* ============================================
   PATRIMÔNIO - JavaScript com Validações
   ============================================ */

'use strict';

/* ---------- CONFIGURAÇÕES ---------- */
const STORAGE_KEY = 'patrimonio_app_v1';
const MAX_DESC_LENGTH = 60;
const MAX_AMOUNT = 999_999_999;
const MIN_AMOUNT = 0.01;

const DEFAULT_CATS = [
  { id: 'reserva',   name: 'Reserva de Emergência', pct: 20, color: '#10B981' },
  { id: 'rfixa',     name: 'Renda Fixa',            pct: 25, color: '#0A2540' },
  { id: 'fii',       name: 'Fundos Imobiliários',   pct: 15, color: '#2563EB' },
  { id: 'acoes',     name: 'Ações',                 pct: 20, color: '#D97706' },
  { id: 'cripto',    name: 'Criptomoedas',          pct: 5,  color: '#7C3AED' },
  { id: 'objetivos', name: 'Objetivos Pessoais',    pct: 15, color: '#DC2626' },
];

/* ---------- ESTADO ---------- */
let state = loadState() || createInitialState();

function createInitialState() {
  return {
    transactions: [],
    goals: [],
    categories: DEFAULT_CATS.map(c => ({ ...c })),
    theme: detectSystemTheme(),
    txType: 'income',
  };
}

function detectSystemTheme() {
  try {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  } catch {
    return 'light';
  }
}

/* ---------- HELPERS ---------- */
const $  = sel => document.querySelector(sel);
const $$ = sel => document.querySelectorAll(sel);

const BRL = v => Number(v || 0).toLocaleString('pt-BR', {
  style: 'currency', currency: 'BRL',
});

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

function clamp(n, min, max) {
  return Math.min(Math.max(n, min), max);
}

function formatDate(iso) {
  const d = new Date(iso);
  const today = new Date();
  const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);

  const sameDay = (a, b) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  if (sameDay(d, today)) return 'Hoje ' + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  if (sameDay(d, yesterday)) return 'Ontem';
  return d.toLocaleDateString('pt-BR');
}

/* ---------- PERSISTÊNCIA ---------- */
function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Falha ao salvar:', e);
    toast('Erro ao salvar dados', 'error');
  }
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    // Validação básica de estrutura
    if (!data || typeof data !== 'object') return null;
    if (!Array.isArray(data.transactions)) data.transactions = [];
    if (!Array.isArray(data.goals)) data.goals = [];
    if (!Array.isArray(data.categories) || data.categories.length === 0) {
      data.categories = DEFAULT_CATS.map(c => ({ ...c }));
    }
    if (!['light', 'dark'].includes(data.theme)) data.theme = 'light';
    if (!['income', 'expense'].includes(data.txType)) data.txType = 'income';
    return data;
  } catch (e) {
    console.error('Falha ao carregar:', e);
    return null;
  }
}

/* ---------- TOAST ---------- */
let toastTimer = null;
function toast(msg, type = 'info') {
  const t = $('#toast');
  if (!t) return;
  t.textContent = msg;
  t.style.background = type === 'error' ? 'var(--danger)' :
                       type === 'success' ? 'var(--brand)' : 'var(--brand-2)';
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2200);
}

/* ---------- VALIDAÇÕES ---------- */
function validateAmount(value) {
  const n = parseFloat(String(value).replace(',', '.'));
  if (!isFinite(n) || isNaN(n)) return { ok: false, msg: 'Valor inválido' };
  if (n <= 0) return { ok: false, msg: 'O valor deve ser maior que zero' };
  if (n < MIN_AMOUNT) return { ok: false, msg: `Valor mínimo: R$ ${MIN_AMOUNT.toFixed(2)}` };
  if (n > MAX_AMOUNT) return { ok: false, msg: 'Valor muito alto' };
  return { ok: true, value: Math.round(n * 100) / 100 };
}

function validateDescription(value) {
  const v = String(value || '').trim();
  if (!v) return { ok: false, msg: 'Descrição obrigatória' };
  if (v.length < 2) return { ok: false, msg: 'Descrição muito curta' };
  if (v.length > MAX_DESC_LENGTH) return { ok: false, msg: `Máximo ${MAX_DESC_LENGTH} caracteres` };
  return { ok: true, value: v };
}

function validatePercentage(value) {
  const n = parseFloat(String(value).replace(',', '.'));
  if (!isFinite(n) || isNaN(n)) return 0;
  return clamp(Math.round(n * 100) / 100, 0, 100);
}

/* ---------- TEMA ---------- */
function applyTheme() {
  document.documentElement.setAttribute('data-theme', state.theme);
  const btn = $('#themeBtn');
  if (btn) {
    btn.textContent = state.theme === 'dark' ? '☀️' : '🌙';
    btn.setAttribute('aria-label', state.theme === 'dark' ? 'Modo claro' : 'Modo escuro');
  }
}

function setupTheme() {
  $('#themeBtn').addEventListener('click', () => {
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    applyTheme();
    saveState();
  });
}

/* ---------- TABS ---------- */
function setupTabs() {
  $$('.tab').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;
      $$('.tab').forEach(b => b.classList.remove('active'));
      $$('.panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      $('#tab-' + target).classList.add('active');
      if (target === 'distribuicao') renderDistribuicao();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
}

/* ---------- TIPO DE TRANSAÇÃO ---------- */
function setupTypeToggle() {
  $$('.t-opt').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('.t-opt').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.txType = btn.dataset.type;
    });
  });
  $$('.t-opt').forEach(b => {
    b.classList.toggle('active', b.dataset.type === state.txType);
  });
}

/* ---------- TOTAIS ---------- */
function getTotals() {
  let inc = 0, exp = 0;
  for (const t of state.transactions) {
    if (t.type === 'income') inc += t.amount;
    else if (t.type === 'expense') exp += t.amount;
  }
  return { inc, exp, balance: inc - exp };
}

function renderHero() {
  const { inc, exp, balance } = getTotals();
  $('#totalBalance').textContent = BRL(balance);
  $('#totalIncome').textContent = BRL(inc);
  $('#totalExpense').textContent = BRL(exp);
  $('#totalBalance').style.color = balance < 0 ? '#fca5a5' : '#fff';
}

/* ---------- TRANSAÇÕES ---------- */
function setupTransactionForm() {
  const descInput = $('#txDesc');
  const amtInput = $('#txAmount');
  const addBtn = $('#addTx');

  descInput.setAttribute('maxlength', MAX_DESC_LENGTH);

  [descInput, amtInput].forEach(el => {
    el.addEventListener('keydown', e => {
      if (e.key === 'Enter') { e.preventDefault(); addBtn.click(); }
    });
  });

  addBtn.addEventListener('click', () => {
    const descVal = validateDescription(descInput.value);
    if (!descVal.ok) { toast(descVal.msg, 'error'); descInput.focus(); return; }

    const amtVal = validateAmount(amtInput.value);
    if (!amtVal.ok) { toast(amtVal.msg, 'error'); amtInput.focus(); return; }

    state.transactions.unshift({
      id: uid(),
      type: state.txType,
      description: descVal.value,
      amount: amtVal.value,
      date: new Date().toISOString(),
    });

    descInput.value = '';
    amtInput.value = '';
    descInput.focus();
    saveState();
    renderHero();
    renderTransactions();
    toast('Movimentação adicionada', 'success');
  });
}

function renderTransactions() {
  const list = $('#txList');
  const count = state.transactions.length;
  $('#txCount').textContent = count + (count === 1 ? ' item' : ' itens');

  if (count === 0) {
    list.innerHTML = '<li class="empty">Nenhuma movimentação ainda 💸</li>';
    return;
  }

  list.innerHTML = state.transactions.map(t => `
    <li class="tx-item" data-id="${t.id}">
      <div class="tx-icon ${t.type}">${t.type === 'income' ? '↑' : '↓'}</div>
      <div class="tx-info">
        <strong>${escapeHtml(t.description)}</strong>
        <small>${formatDate(t.date)}</small>
      </div>
      <span class="tx-amount ${t.type}">
        ${t.type === 'income' ? '+' : '-'}${BRL(t.amount)}
      </span>
      <button class="tx-del" data-id="${t.id}" aria-label="Excluir">×</button>
    </li>
  `).join('');

  list.querySelectorAll('.tx-del').forEach(btn => {
    btn.addEventListener('click', () => {
      if (!confirm('Excluir esta movimentação?')) return;
      state.transactions = state.transactions.filter(x => x.id !== btn.dataset.id);
      saveState();
      renderHero();
      renderTransactions();
      toast('Movimentação removida');
    });
  });
}

/* ---------- DISTRIBUIÇÃO ---------- */
function renderDistribuicao() {
  const { balance } = getTotals();
  const positive = Math.max(0, balance);
  const cats = state.categories;
  const total = cats.reduce((s, c) => s + (Number(c.pct) || 0), 0);

  const sumEl = $('#pctSum');
  sumEl.textContent = total.toFixed(1) + '%';
  sumEl.style.color = Math.abs(total - 100) > 0.1 ? 'var(--danger)' : 'var(--brand)';

  $('#donutTotal').textContent = BRL(positive);

  const svg = $('#donut');
  const r = 80, cx = 100, cy = 100, C = 2 * Math.PI * r;
  let offset = 0;
  let segs = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="var(--surface-2)" stroke-width="28"/>`;

  if (total > 0 && positive >= 0) {
    cats.forEach(c => {
      const pct = (Number(c.pct) || 0) / total;
      if (pct <= 0) return;
      const len = pct * C;
      segs += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none"
        stroke="${c.color}" stroke-width="28"
        stroke-dasharray="${len.toFixed(2)} ${(C - len).toFixed(2)}"
        stroke-dashoffset="${(-offset).toFixed(2)}"
        transform="rotate(-90 ${cx} ${cy})"
        stroke-linecap="butt"/>`;
      offset += len;
    });
  }
  svg.innerHTML = segs;

  $('#legend').innerHTML = cats.map(c => {
    const amount = positive * ((Number(c.pct) || 0) / 100);
    return `<li>
      <span class="dot" style="background:${c.color}"></span>
      <span>${escapeHtml(c.name)}
        <small class="muted">${c.pct}% • ${BRL(amount)}</small>
      </span>
    </li>`;
  }).join('');

  $('#allocList').innerHTML = cats.map((c, i) => `
    <li class="alloc-row">
      <span class="dot" style="background:${c.color}"></span>
      <span class="name">${escapeHtml(c.name)}</span>
      <input type="number" inputmode="decimal" data-i="${i}"
        min="0" max="100" step="0.1" value="${c.pct}" aria-label="Porcentagem ${c.name}">
    </li>
  `).join('');

  $$('#allocList input').forEach(inp => {
    inp.addEventListener('input', () => {
      const total = Array.from($$('#allocList input'))
        .reduce((s, el) => s + (parseFloat(el.value) || 0), 0);
      sumEl.textContent = total.toFixed(1) + '%';
      sumEl.style.color = Math.abs(total - 100) > 0.1 ? 'var(--danger)' : 'var(--brand)';
    });
  });
}

function setupAllocations() {
  $('#saveAllocs').addEventListener('click', () => {
    const inputs = $$('#allocList input');
    const values = Array.from(inputs).map(inp => validatePercentage(inp.value));
    const sum = values.reduce((s, v) => s + v, 0);

    if (Math.abs(sum - 100) > 0.5) {
      toast(`Soma deve ser 100% (atual: ${sum.toFixed(1)}%)`, 'error');
      return;
    }

    inputs.forEach((inp, i) => {
      const idx = parseInt(inp.dataset.i, 10);
      state.categories[idx].pct = values[i];
    });

    saveState();
    renderDistribuicao();
    toast('Porcentagens salvas', 'success');
  });
}

/* ---------- METAS ---------- */
function setupGoalForm() {
  const nameInput = $('#goalName');
  const targetInput = $('#goalTarget');
  const currentInput = $('#goalCurrent');
  const addBtn = $('#addGoal');

  nameInput.setAttribute('maxlength', 40);

  [nameInput, targetInput, currentInput].forEach(el => {
    el.addEventListener('keydown', e => {
      if (e.key === 'Enter') { e.preventDefault(); addBtn.click(); }
    });
  });

  addBtn.addEventListener('click', () => {
    const name = nameInput.value.trim();
    if (!name) { toast('Nome obrigatório', 'error'); nameInput.focus(); return; }
    if (name.length < 2) { toast('Nome muito curto', 'error'); return; }

    const targetVal = validateAmount(targetInput.value);
    if (!targetVal.ok) { toast(targetVal.msg, 'error'); targetInput.focus(); return; }

    const current = parseFloat(String(currentInput.value || '0').replace(',', '.')) || 0;
    if (current < 0) { toast('Acumulado não pode ser negativo', 'error'); return; }
    if (current > targetVal.value) {
      toast('Acumulado maior que o alvo? Ajustamos para o alvo', 'info');
    }

    state.goals.push({
      id: uid(),
      name,
      target: targetVal.value,
      current: Math.min(current, targetVal.value),
      createdAt: new Date().toISOString(),
    });

    nameInput.value = '';
    targetInput.value = '';
    currentInput.value = '';
    nameInput.focus();
    saveState();
    renderGoals();
    toast('Meta criada', 'success');
  });
}

function renderGoals() {
  const list = $('#goalList');
  if (state.goals.length === 0) {
    list.innerHTML = '<li class="empty">Nenhuma meta ainda 🎯</li>';
    return;
  }

  list.innerHTML = state.goals.map(g => {
    const pct = clamp((g.current / g.target) * 100, 0, 100);
    const completed = pct >= 100;
    return `
      <li class="goal-item" data-id="${g.id}">
        <div class="goal-top">
          <span class="goal-name">${escapeHtml(g.name)}${completed ? ' ✅' : ''}</span>
          <span class="goal-pct">${pct.toFixed(0)}%</span>
        </div>
        <p class="goal-sub">${BRL(g.current)} de ${BRL(g.target)}</p>
        <div class="progress"><span style="width:${pct}%"></span></div>
        <div class="goal-actions">
          <button data-id="${g.id}" class="add" ${completed ? 'disabled' : ''}>
            ${completed ? 'Concluída' : '+ R$ 100'}
          </button>
          <button data-id="${g.id}" class="edit">Editar</button>
          <button data-id="${g.id}" class="del">Excluir</button>
        </div>
      </li>`;
  }).join('');

  list.querySelectorAll('.add').forEach(btn => {
    if (btn.disabled) return;
    btn.addEventListener('click', () => {
      const g = state.goals.find(x => x.id === btn.dataset.id);
      if (!g) return;
      g.current = Math.min(g.target, g.current + 100);
      saveState();
      renderGoals();
      toast(g.current >= g.target ? '🎉 Meta concluída!' : '+R$ 100 na meta', 'success');
    });
  });

  list.querySelectorAll('.edit').forEach(btn => {
    btn.addEventListener('click', () => {
      const g = state.goals.find(x => x.id === btn.dataset.id);
      if (!g) return;
      const input = prompt(`Editar acumulado para "${g.name}"\n(Alvo: ${BRL(g.target)})`, g.current);
      if (input === null) return;
      const v = validateAmount(input);
      if (!v.ok && parseFloat(input) !== 0) { toast(v.msg, 'error'); return; }
      const val = Math.max(0, parseFloat(String(input).replace(',', '.')) || 0);
      g.current = Math.min(val, g.target);
      saveState();
      renderGoals();
      toast('Meta atualizada', 'success');
    });
  });

  list.querySelectorAll('.del').forEach(btn => {
    btn.addEventListener('click', () => {
      const g = state.goals.find(x => x.id === btn.dataset.id);
      if (!g || !confirm(`Excluir meta "${g.name}"?`)) return;
      state.goals = state.goals.filter(x => x.id !== btn.dataset.id);
      saveState();
      renderGoals();
      toast('Meta removida');
    });
  });
}

/* ---------- RESET ---------- */
function setupReset() {
  $('#resetBtn').addEventListener('click', () => {
    const confirm1 = confirm('Apagar TODOS os dados?\n\nMovimentações, metas e configurações serão perdidas.');
    if (!confirm1) return;
    const confirm2 = confirm('Tem certeza? Essa ação NÃO pode ser desfeita.');
    if (!confirm2) return;

    const keepTheme = state.theme;
    state = createInitialState();
    state.theme = keepTheme;
    saveState();
    renderAll();
    applyTheme();
    toast('Dados redefinidos com sucesso', 'success');
  });
}

/* ---------- ATALHOS DE TECLADO ---------- */
function setupKeyboardShortcuts() {
  document.addEventListener('keydown', e => {
    if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;

    if (e.altKey && ['1', '2', '3'].includes(e.key)) {
      e.preventDefault();
      const idx = parseInt(e.key, 10) - 1;
      $$('.tab')[idx]?.click();
    }
    if (e.altKey && e.key.toLowerCase() === 't') {
      e.preventDefault();
      $('#themeBtn').click();
    }
  });
}

/* ---------- RENDER GERAL ---------- */
function renderAll() {
  renderHero();
  renderTransactions();
  renderGoals();
  if ($('#tab-distribuicao')?.classList.contains('active')) renderDistribuicao();
}

/* ---------- SYNC ENTRE ABAS ---------- */
function setupStorageSync() {
  window.addEventListener('storage', e => {
    if (e.key !== STORAGE_KEY) return;
    const fresh = loadState();
    if (fresh) {
      state = fresh;
      applyTheme();
      renderAll();
      toast('Dados sincronizados');
    }
  });
}

/* ---------- INICIALIZAÇÃO ---------- */
function init() {
  applyTheme();
  setupTheme();
  setupTabs();
  setupTypeToggle();
  setupTransactionForm();
  setupAllocations();
  setupGoalForm();
  setupReset();
  setupKeyboardShortcuts();
  setupStorageSync();
  renderAll();
  console.log('%c💰 Patrimônio carregado!', 'color:#10B981;font-weight:bold;font-size:14px');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
