import { getHouseColor, getHouseEmoji, hpColor } from './utils.js';

export function renderCardHTML(char) {
  const pct = char.hp / char.maxHp;
  const houseColor = getHouseColor(char.house);
  const houseEmoji = getHouseEmoji(char.house);
  const safeHp = Math.max(0, char.hp);
  const hpWidth = Math.max(0, pct * 100);

  return `
    <div class="card-img">
      <img src="${char.image}" alt="${char.name}" onerror="this.src='https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/300px-No_image_available.svg.png'">
      <div class="house-badge" style="background:${houseColor}">${houseEmoji}</div>
    </div>
    <div class="card-body">
      <div class="card-name">${char.name}</div>
      <div class="card-meta">${char.species} · ${char.house}</div>
      <div class="hp-bar-wrap">
        <span class="hp-label">HP</span>
        <div class="hp-track"><div class="hp-fill" style="width:${hpWidth}%;background:${hpColor(pct)}"></div></div>
        <span class="hp-val">${safeHp}/${char.maxHp}</span>
      </div>
      <div class="mini-stats">
        <div class="mini-stat"><span class="mini-stat-icon">⚡</span><span class="mini-stat-val">${char.power}</span><span class="mini-stat-lbl">Poder</span></div>
        <div class="mini-stat"><span class="mini-stat-icon">🔮</span><span class="mini-stat-val">${char.magic}</span><span class="mini-stat-lbl">Magia</span></div>
        <div class="mini-stat"><span class="mini-stat-icon">🛡</span><span class="mini-stat-val">${char.defense}</span><span class="mini-stat-lbl">Defesa</span></div>
      </div>
    </div>
  `;
}

export function renderDeckBadgesHTML(deck, activeIdx) {
  return deck.map((char, i) => {
    let cls = 'deck-thumb';
    if (char.hp <= 0) cls += ' dead';
    else if (i === activeIdx) cls += ' active';
    
    return `<div class="${cls}"><img src="${char.image}" onerror="this.src='https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/300px-No_image_available.svg.png'"></div>`;
  }).join('');
}

export function renderSpellsHTML(spells, enabled) {
  return spells.map((sp, i) => {
    const isHeal = sp.damage < 0;
    const dmgLabel = isHeal ? `💚 +${Math.abs(sp.damage)} HP` : `💀 ${sp.damage} dmg`;
    const dmgClass = isHeal ? 'spell-dmg heal' : 'spell-dmg attack';
    const dis = enabled ? '' : 'disabled';
    
    return `
      <button class="spell-btn" ${dis} data-idx="${i}">
        <div><span class="spell-name">${sp.name}</span><span class="spell-effect">${sp.effect}</span></div>
        <span class="${dmgClass}">${dmgLabel}</span>
      </button>
    `;
  }).join('');
}

export function showScreen(id) {
  document.querySelectorAll('.screen').forEach((s) => s.classList.remove('active'));
  const el = document.getElementById(id);
  if (el) el.classList.add('active');
}

export function logBattle(msg, type = 'info') {
  const el = document.getElementById('battleLog');
  const span = document.createElement('span');
  span.className = `log-entry ${type}`;
  span.textContent = msg;
  el.appendChild(span);
  el.scrollTop = el.scrollHeight;
}

export function setStatus(msg) {
  document.getElementById('battleStatus').textContent = msg;
}