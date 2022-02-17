const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;

const app = express();

app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const HTTP_NOT_FOUND_STATUS = 404;
const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.get('/talker', async (_req, res, _next) => {
  const talkers = await fs.readFile('./talker.json', 'utf-8');
  const talkersParsed = JSON.parse(talkers);
  return res.status(HTTP_OK_STATUS).json(talkersParsed);
});

app.get('/talker/:id', async (req, res, _next) => {
  const { id } = req.params;
  const talkers = await fs.readFile('./talker.json', 'utf-8');
  const talkersParsed = JSON.parse(talkers);
  const talker = talkersParsed.find((person) => person.id === Number(id));
  if (!talker) {
    return res.status(HTTP_NOT_FOUND_STATUS).json({ message: 'Pessoa palestrante não encontrada' });
  }
  return res.status(HTTP_OK_STATUS).json(talker);
});

app.listen(PORT, () => {
  console.log('Online');
});
