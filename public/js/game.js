import { fetchPack, fetchSpells, fetchCpuDeck } from './api.js';
import { renderCardHTML, renderDeckBadgesHTML, renderSpellsHTML, showScreen, logBattle, setStatus } from './render.js';
import { CONFIG, shuffleArray, sleep } from './utils.js';

export const state = {
  pack: [],
  selectedCards: [],
  playerDeck: [],
  cpuDeck: [],
  spells: [],
  playerSpells: [],
  round: 1,
  scoreP: 0,
  scoreC: 0,
  waiting: false,
};

export function renderPack() {
  const grid = document.getElementById('packGrid');
  grid.innerHTML = '';
  
  state.pack.forEach((char, i) => {
    const isSelected = state.selectedCards.includes(i);
    const div = document.createElement('div');
    div.className = `card ${isSelected ? 'selected' : ''}`;
    div.innerHTML = renderCardHTML(char);
    div.dataset.idx = i;
    grid.appendChild(div);
  });
  
  document.getElementById('draftCount').textContent = state.selectedCards.length;
  document.getElementById('btnConfirmDraft').disabled = state.selectedCards.length < CONFIG.REQUIRED_DRAFT_CARDS;
}

export function toggleDraftCard(idx) {
  const pos = state.selectedCards.indexOf(idx);
  if (pos >= 0) {
    state.selectedCards.splice(pos, 1);
  } else if (state.selectedCards.length < CONFIG.REQUIRED_DRAFT_CARDS) {
    state.selectedCards.push(idx);
  }
  renderPack();
}

export async function rerollPack() {
  state.selectedCards = [];
  document.getElementById('packGrid').innerHTML = '<div style="text-align:center;padding:40px;color:var(--parchment-dark);grid-column:1/-1">Invocando novos bruxos...</div>';
  const data = await fetchPack();
  state.pack = data.cards;
  renderPack();
}

function getActiveIdx(deck) {
  return deck.findIndex((char) => char.hp > 0);
}

export function renderBattleState() {
  const pIdx = getActiveIdx(state.playerDeck);
  const cIdx = getActiveIdx(state.cpuDeck);

  if (pIdx < 0 || cIdx < 0) return;

  const pChar = state.playerDeck[pIdx];
  const cChar = state.cpuDeck[cIdx];

  document.getElementById('playerActiveName').textContent = pChar.name;
  document.getElementById('cpuActiveName').textContent = cChar.name;

  document.getElementById('playerCardSlot').innerHTML = `<div class="card battle-card" id="battleCardP">${renderCardHTML(pChar)}</div>`;
  document.getElementById('cpuCardSlot').innerHTML = `<div class="card battle-card" id="battleCardC">${renderCardHTML(cChar)}</div>`;

  document.getElementById('playerDeckBadges').innerHTML = renderDeckBadgesHTML(state.playerDeck, pIdx);
  document.getElementById('cpuDeckBadges').innerHTML = renderDeckBadgesHTML(state.cpuDeck, cIdx);
  
  document.getElementById('spellList').innerHTML = renderSpellsHTML(state.playerSpells, !state.waiting);
}

export function endGame() {
  const over = document.getElementById('screen-over');
  const elements = {
    glyph: document.getElementById('overGlyph'),
    title: document.getElementById('overTitle'),
    sub: document.getElementById('overSub'),
    score: document.getElementById('overScore'),
  };

  if (state.scoreP > state.scoreC) {
    elements.glyph.textContent = '🏆';
    elements.title.textContent = 'Vitória!';
    elements.sub.textContent = 'Você dominou o duelo!';
  } else if (state.scoreC > state.scoreP) {
    elements.glyph.textContent = '💀';
    elements.title.textContent = 'Derrota';
    elements.sub.textContent = 'O CPU foi mais poderoso desta vez.';
  } else {
    elements.glyph.textContent = '✦';
    elements.title.textContent = 'Empate';
    elements.sub.textContent = 'Bruxos igualmente poderosos.';
  }
  
  elements.score.textContent = `Você ${state.scoreP}  ×  ${state.scoreC} CPU`;
  over.classList.add('active');
}

export async function castSpell(spellIdx) {
  if (state.waiting) return;
  state.waiting = true;
  document.getElementById('spellList').innerHTML = renderSpellsHTML(state.playerSpells, false);

  const sp = state.playerSpells[spellIdx];
  const pChar = state.playerDeck[getActiveIdx(state.playerDeck)];
  const cChar = state.cpuDeck[getActiveIdx(state.cpuDeck)];

  // Player Turn
  const pDmg = Math.floor(sp.damage * (pChar.magic / 100) * (Math.random() * 0.4 + 0.8));
  if (sp.damage < 0) {
    const heal = Math.abs(pDmg);
    pChar.hp = Math.min(pChar.maxHp, pChar.hp + heal);
    logBattle(`✨ ${sp.name} — você curou ${heal} HP! (${pChar.name}: ${pChar.hp} HP)`, 'heal');
    document.getElementById('battleCardP').classList.add('battling');
  } else {
    cChar.hp -= pDmg;
    logBattle(`⚡ ${sp.name} → ${cChar.name} perdeu ${pDmg} HP! (${cChar.name}: ${Math.max(0, cChar.hp)} HP)`, 'win');
    document.getElementById('battleCardC').classList.add('hit');
  }

  await sleep(CONFIG.TURN_DELAY_MS);

  // CPU Turn
  const cpuSp = state.spells[Math.floor(Math.random() * state.spells.length)];
  const cpuDmg = Math.floor(cpuSp.damage * (cChar.magic / 100) * (Math.random() * 0.4 + 0.8));

  if (cpuSp.damage < 0) {
    const cpuHeal = Math.abs(cpuDmg);
    cChar.hp = Math.min(cChar.maxHp, cChar.hp + cpuHeal);
    logBattle(`🧙 CPU: ${cpuSp.name} — CPU curou ${cpuHeal} HP! (${cChar.name}: ${cChar.hp} HP)`, 'heal');
    document.getElementById('battleCardC').classList.add('battling');
  } else {
    pChar.hp -= cpuDmg;
    logBattle(`💀 CPU: ${cpuSp.name} → ${pChar.name} perdeu ${cpuDmg} HP! (${pChar.name}: ${Math.max(0, pChar.hp)} HP)`, 'lose');
    document.getElementById('battleCardP').classList.add('hit');
  }

  await sleep(CONFIG.TURN_DELAY_MS);

  // Death Checks
  let roundOver = false;
  if (pChar.hp <= 0) {
    logBattle(`💀 ${pChar.name} foi derrotado!`, 'lose');
    state.scoreC += 1;
    document.getElementById('scoreC').textContent = state.scoreC;
    roundOver = true;
  }
  if (cChar.hp <= 0) {
    logBattle(`🏆 ${cChar.name} foi derrotado!`, 'win');
    state.scoreP += 1;
    document.getElementById('scoreP').textContent = state.scoreP;
    roundOver = true;
  }

  renderBattleState();

  if (getActiveIdx(state.playerDeck) < 0 || getActiveIdx(state.cpuDeck) < 0) {
    await sleep(CONFIG.TURN_DELAY_MS);
    endGame();
    return;
  }

  state.waiting = false;
  if (roundOver) {
    state.round += 1;
    document.getElementById('roundNum').textContent = state.round;
    logBattle(`— Rodada ${state.round} —`, 'info');
  }

  setStatus('Escolha um feitiço para atacar!');
  document.getElementById('spellList').innerHTML = renderSpellsHTML(state.playerSpells, true);
}

export function startBattle() {
  state.round = 1;
  state.scoreP = 0;
  state.scoreC = 0;
  state.waiting = false;

  document.getElementById('scoreP').textContent = '0';
  document.getElementById('scoreC').textContent = '0';
  document.getElementById('roundNum').textContent = '1';
  document.getElementById('battleLog').innerHTML = '';
  document.getElementById('btnNext').style.display = 'none';

  showScreen('screen-battle');
  renderBattleState();
  logBattle('⚔ O duelo começou! Escolha um feitiço para atacar.', 'info');
  setStatus('Escolha um feitiço para atacar!');
}