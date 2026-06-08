const express = require('express');
const { fetchSpells, shuffleArray } = require('../services/potterApi');
const { calculateSpellDamage } = require('../services/statsCalculator');
const CONSTANTS = require('../constants');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const result = await fetchSpells();
    const validSpells = result.data.filter((spell) => spell.attributes.name);

    const processed = validSpells.map((spell) => {
      const { attributes } = spell;
      return {
        id: spell.id,
        name: attributes.name,
        effect: attributes.effect || 'Efeito desconhecido',
        category: attributes.category || 'Spell',
        light: attributes.light || 'Unknown',
        damage: calculateSpellDamage(attributes.category),
      };
    });

    const shuffled = shuffleArray(processed);
    res.json({ spells: shuffled.slice(0, CONSTANTS.SPELLS_COUNT) });
  } catch (error) {
    res.status(500).json({ error: 'Erro interno ao gerar feitiços' });
  }
});

module.exports = router;