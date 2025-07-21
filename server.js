const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

const FILE_PATH = path.join(__dirname, 'fofocas.json');

app.use(express.static('public'));
app.use(express.json());

function lerFofocas() {
  if (!fs.existsSync(FILE_PATH)) return [];
  return JSON.parse(fs.readFileSync(FILE_PATH, 'utf8'));
}

function salvarFofocas(fofocas) {
  fs.writeFileSync(FILE_PATH, JSON.stringify(fofocas, null, 2));
}

let historicoRecentes = [];

app.post('/fofoca', (req, res) => {
  const { fofoca } = req.body;
  if (!fofoca) return res.status(400).send('Fofoca vazia.');

  const fofocas = lerFofocas();
  fofocas.push(fofoca);
  salvarFofocas(fofocas);

  let sugestoes = fofocas.filter(f => f !== fofoca && !historicoRecentes.includes(f));
  if (sugestoes.length === 0) sugestoes = fofocas.filter(f => f !== fofoca);

  const escolhida = sugestoes[Math.floor(Math.random() * sugestoes.length)];

  historicoRecentes.push(escolhida);
  if (historicoRecentes.length > 2) historicoRecentes.shift();

  res.json({ resposta: escolhida || "Ainda não temos muitas fofocas... volte depois!" });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
