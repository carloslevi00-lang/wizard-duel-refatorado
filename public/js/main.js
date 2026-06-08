import { fetchPack, fetchSpells, fetchCpuDeck } from './api.js';
import { state, renderPack, toggleDraftCard, rerollPack, startBattle, castSpell } from './game.js';
import { shuffleArray, CONFIG } from './utils.js';
import { showScreen } from './render.js';

async function loadGame() {
  const bar = document.getElementById('loadBar');
  const msg = document.getElementById('loadMsg');

  msg.textContent = 'Invocando personagens...';
  bar.style.width = '20%';

  const packData = await fetchPack();
  state.pack = packData.cards;

  bar.style.width = '55%';
  msg.textContent = 'Consultando o livro de feitiços...';

  const spellData = await fetchSpells();
  state.spells = spellData.spells;

  bar.style.width = '85%';
  msg.textContent = 'Preparando o adversário...';

  const cpuData = await fetchCpuDeck();
  state.cpuDeck = cpuData.deck;

  state.playerSpells = shuffleArray(state.spells).slice(0, CONFIG.PLAYER_SPELLS_COUNT);

  bar.style.width = '100%';
  msg.textContent = 'Pronto!';

  setTimeout(() => {
    document.getElementById('screen-loading').classList.add('fade-out');
    setTimeout(() => {
      document.getElementById('screen-loading').style.display = 'none';
      showScreen('screen-draft');
      renderPack();
    }, 600);
  }, 400);
}

function initEvents() {
  document.getElementById('packGrid').addEventListener('click', (e) => {
    const card = e.target.closest('.card');
    if (card) toggleDraftCard(parseInt(card.dataset.idx, 10));
  });

  document.getElementById('spellList').addEventListener('click', (e) => {
    const btn = e.target.closest('.spell-btn');
    if (btn && !btn.disabled) castSpell(parseInt(btn.dataset.idx, 10));
  });

  document.getElementById('btnConfirmDraft').addEventListener('click', () => {
    if (state.selectedCards.length < CONFIG.REQUIRED_DRAFT_CARDS) return;
    state.playerDeck = [
      state.pack[state.selectedCards[0]],
      state.pack[state.selectedCards[1]],
    ];
    startBattle();
  });

  document.getElementById('btnRerollPack').addEventListener('click', rerollPack);

  document.getElementById('btnRestart').addEventListener('click', () => {
    document.getElementById('screen-over').classList.remove('active');
    state.selectedCards = [];
    state.pack = [];
    state.playerDeck = [];

    const loadEl = document.getElementById('screen-loading');
    loadEl.style.display = 'flex';
    loadEl.classList.remove('fade-out');
    document.getElementById('loadBar').style.width = '0%';
    showScreen('');
    loadGame();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initEvents();
  loadGame();
});