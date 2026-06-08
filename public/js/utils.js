export const CONFIG = {
  REQUIRED_DRAFT_CARDS: 2,
  PLAYER_SPELLS_COUNT: 5,
  TURN_DELAY_MS: 800,
  ANIMATION_DELAY_MS: 600,
  HEAL_DELAY_MS: 500,
};

export function getHouseColor(house) {
  const colors = {
    Gryffindor: '#6b1010',
    Slytherin: '#0a3018',
    Hufflepuff: '#3a2800',
    Ravenclaw: '#0a1a3a',
  };
  return colors[house] || '#1e1040';
}

export function getHouseEmoji(house) {
  const emojis = {
    Gryffindor: '🦁',
    Slytherin: '🐍',
    Hufflepuff: '🦡',
    Ravenclaw: '🦅',
  };
  return emojis[house] || '✦';
}

export function hpColor(pct) {
  if (pct > 0.6) return 'linear-gradient(90deg,#0a4a2a,#22cc77)';
  if (pct > 0.3) return 'linear-gradient(90deg,#4a3a00,#ccaa22)';
  return 'linear-gradient(90deg,#4a0a0a,#cc2222)';
}

export function sleep(ms) {
  return new Promise((resolve) => { setTimeout(resolve, ms); });
}

export function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}