const express = require('express');
const characterRoutes = require('./routes/characters');
const spellRoutes = require('./routes/spells');
const gameRoutes = require('./routes/game');

const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use(express.json());

app.use('/api', characterRoutes);
app.use('/api/spells', spellRoutes);
app.use('/api', gameRoutes);

app.listen(PORT, () => {
  console.info(`Servidor rodando na porta ${PORT}`);
});