# Relatório de Refatoração - Wizard Duel

## Lista de Problemas Encontrados no Código Original
1. **Números Mágicos**: Existiam diversos valores "chumbados" (hardcoded) (ex: `90`, `100`, `800`) espalhados pelos arquivos.
2. **Nomes sem Significado**: Variáveis como `pw`, `mg`, `df`, `a`, `c` dificultavam o entendimento da intenção do autor.
3. **Código Duplicado**: A lógica de cálculo de atributos dos personagens (`power`, `magic`, etc) era repetida nos endpoints `/api/pack` e `/api/cpu-deck`. O script de randomização via "loop de embaralhamento" também se repetia 3x no back-end.
4. **Acoplamento**: O `index.js` cuidava das rotas, lógica de regras de negócio e integrações externas. No front-end, estilos, manipulação da DOM e lógica de jogo viviam no mesmo arquivo.
5. **Anti-patterns**: 
   - Uso excessivo de var.
   - Uso de `==` em vez de igualdade estrita `===`.
   - Concatenação pesada de strings em vez de Template Literals no front-end.
   - Event listeners atrelados no inline de HTML (`onclick="castSpell(0)"`).
   - Abuso do `console.log(e)` no back sem o devido tratamento da response.

## Decisões Arquiteturais Tomadas
- **Back-end Modular**: Criamos uma pasta `services/` (para chamadas na API externa e cálculos das regras de negócio) e uma pasta `routes/` isolando endpoints.
- **Isolamento de Constantes**: Um arquivo global `constants.js` foi criado exportando todos os dados brutos e mutáveis.
- **Front-end com ES Modules**: O JS puro no browser foi dividido em múltiplos arquivos que se importam de maneira nativa (`api.js`, `game.js`, `render.js`, `main.js`), sem precisar de bundler como o Webpack.
- **Assincronicidade Clean**: A lógica das rodadas (`castSpell`), que era um inferno de `setTimeout` aninhados, foi reescrita com `async/await` e um utilitário de delay (`sleep(ms)`).
- **Event Delegation**: Substituímos os clicks inline e os binds de loops no DOM por EventListeners amarrados aos elementos "mãe" (`#packGrid`, `#spellList`) com o uso de `dataset.idx`.

## Como executar o projeto e o Linter
1. Instale as dependências: `npm install`
2. Rode o servidor: `npm start`
3. Acesse a aplicação na URL informada (`http://localhost:3000`).
4. Para checar se as regras do Airbnb foram aplicadas estritamente, execute:
   `npm run lint`