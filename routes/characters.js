const express = require('express');
const { fetchCharacters, shuffleArray } = require('../services/potterApi');
const { calculateCharacterStats } = require('../services/statsCalculator');
const CONSTANTS = require('../constants');

const router = express.Router();

router.get('/pack', async (req, res) => {
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
    res.json({ cards: shuffled.slice(0, CONSTANTS.PACK_SIZE) });
  } catch (error) {
    res.status(500).json({ error: 'Erro interno ao gerar pacote de personagens' });
  }
});

module.exports = router;