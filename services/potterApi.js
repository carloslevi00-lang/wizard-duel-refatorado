const fetch = require('node-fetch');
const CONSTANTS = require('../constants');

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

async function fetchCharacters() {
  const page = Math.floor(Math.random() * CONSTANTS.MAX_PAGES) + 1;
  const response = await fetch(`${CONSTANTS.API_BASE_URL}/characters?page[size]=${CONSTANTS.PAGE_SIZE}&page[number]=${page}`);
  if (!response.ok) throw new Error('Falha ao buscar personagens da API');
  return response.json();
}

async function fetchSpells() {
  const response = await fetch(`${CONSTANTS.API_BASE_URL}/spells?page[size]=${CONSTANTS.PAGE_SIZE}`);
  if (!response.ok) throw new Error('Falha ao buscar feitiços da API');
  return response.json();
}

module.exports = { fetchCharacters, fetchSpells, shuffleArray };