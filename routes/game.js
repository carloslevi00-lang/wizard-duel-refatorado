const express = require('express');
const { fetchCharacters, shuffleArray } = require('../services/potterApi');
const { calculateCharacterStats } = require('../services/statsCalculator');
const CONSTANTS = require('../constants');

const router = express.Router();

router.post('/cpu-deck', async (req, res) => {
  try {
    const result = await fetchCharacters();
    const validCharacters = result.data.filter((char) => char.attributes.name && char.attributes.image);

    const processed = validCharacters.map((char) => {
      const { attributes } = char;
      const stats = calculateCharacterStats(attributes);

      return {
        id: char.id,
        name: attributes.name,
        house: attributes.house || 'Unknown',
        species: attributes.species || 'Unknown',
        ancestry: attributes.ancestry || 'Unknown',
        image: attributes.image,
        ...stats,
        maxHp: stats.hp,
      };
    });

    const shuffled = shuffleArray(processed);
    res.json({ deck: shuffled.slice(0, CONSTANTS.CPU_DECK_SIZE) });
  } catch (error) {
    res.status(500).json({ error: 'Erro interno ao montar deck da CPU' });
  }
});

module.exports = router;