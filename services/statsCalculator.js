const CONSTANTS = require('../constants');

const POWER_MAP = {
  Gryffindor: 90, Slytherin: 85, Ravenclaw: 80, Hufflepuff: 75,
};

const MAGIC_MAP = {
  giant: 95, werewolf: 91, 'half-giant': 88, vampire: 87, 'house elf': 82, centaur: 78, human: 70, ghost: 60,
};

const DEFENSE_MAP = {
  'pure-blood': 90, 'half-blood': 75, 'muggle-born': 70, muggle: 40, squib: 35,
};

const DAMAGE_MAP = {
  Curse: 90, Hex: 65, Jinx: 55, Spell: 50, Charm: 45, Transfiguration: 40, 'Counter-spell': 35, 'Healing spell': -40,
};

function calculateCharacterStats(attributes) {
  const power = POWER_MAP[attributes.house] || CONSTANTS.DEFAULT_STAT;
  const magic = MAGIC_MAP[attributes.species] || CONSTANTS.DEFAULT_STAT;
  const defense = DEFENSE_MAP[attributes.ancestry] || CONSTANTS.DEFAULT_STAT;
  const hp = defense + Math.floor(Math.random() * CONSTANTS.HP_VARIANCE) + CONSTANTS.BASE_HP;

  return {
    power, magic, defense, hp,
  };
}

function calculateSpellDamage(category) {
  return DAMAGE_MAP[category] || 30;
}

module.exports = { calculateCharacterStats, calculateSpellDamage };