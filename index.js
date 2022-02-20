const bodyParser = require('body-parser');
const express = require('express');
const fs = require('fs').promises;
const { login } = require('./middleware/loginMiddleware');

const validateAge = require('./middleware/validateAge');
const validateEmail = require('./middleware/validateEmail');
const validateName = require('./middleware/validateName');
const validatePassword = require('./middleware/validatePassword');
const validateRate = require('./middleware/validateRate');
const validateTalk = require('./middleware/validateTalk');
const validateToken = require('./middleware/validateToken');
const validateWatchedAt = require('./middleware/validateWatchedAt');

const app = express();

const HTTP_OK_STATUS = 200;
const HTTP_CREATED = 201;
const HTTP_NO_CONTENT = 204;
const HTTP_NOT_FOUND = 404;

const PORT = '3000';

const db = './talker.json';

app.use(bodyParser.json());

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.get('/talker', async (_req, res, _next) => {
  const talkers = await fs.readFile(db, 'utf-8');
  const talkersParsed = JSON.parse(talkers);
  return res.status(HTTP_OK_STATUS).json(talkersParsed);
});

app.get(
  '/talker/search',
  validateToken,
  async (req, res, _next) => {
  const { q } = req.query;

  const talkers = await fs.readFile(db, 'utf-8');
  const talkersParsed = JSON.parse(talkers);

  if (!q) return res.status(HTTP_OK_STATUS).json(JSON.stringify(talkersParsed));

  const talkersFiltered = talkersParsed
    .filter((talker) => talker.name.includes(q));

  return res.status(HTTP_OK_STATUS).json(talkersFiltered);
  },
);

app.get('/talker/:id', async (req, res, _next) => {
  const { id } = req.params;
  const talkers = await fs.readFile(db, 'utf-8');
  const talkersParsed = JSON.parse(talkers);
  const talker = talkersParsed.find((person) => person.id === Number(id));
  if (!talker) {
    return res.status(HTTP_NOT_FOUND).json({ message: 'Pessoa palestrante não encontrada' });
  }
  return res.status(HTTP_OK_STATUS).json(talker);
});

app.post('/login', validateEmail, validatePassword, login);

app.post(
  '/talker',
  validateToken,
  validateName,
  validateAge,
  validateTalk,
  validateWatchedAt,
  validateRate,
  async (req, res, _next) => {
  const { name, age, talk } = req.body;

  const talkers = await fs.readFile(db, 'utf-8');
  const talkersParsed = JSON.parse(talkers);
  const newTalker = {
    id: talkersParsed.length + 1,
    name,
    age,
    talk,
  };
  const newTalkersList = [...talkersParsed, newTalker];
  await fs.writeFile(db, JSON.stringify(newTalkersList));
  return res.status(HTTP_CREATED).json(newTalker);
  },
);

app.put(
  '/talker/:id',
  validateToken,
  validateName,
  validateAge,
  validateTalk,
  validateWatchedAt,
  validateRate,
  async (req, res, _next) => {
  const { name, age, talk } = req.body;
  const { id } = req.params;

  const talkers = await fs.readFile(db, 'utf-8');
  const talkersParsed = JSON.parse(talkers);
  const talkersFiltered = talkersParsed.filter((talker) => talker.id !== id);
  const newTalker = { id: Number(id), name, age, talk };
  talkersFiltered.push(newTalker);
  await fs.writeFile(db, JSON.stringify(talkersFiltered));
  return res.status(HTTP_OK_STATUS).json(newTalker);
  },
);

app.delete(
  '/talker/:id',
  validateToken,
  async (req, res, _next) => {
  const { id } = req.params;

  const talkers = await fs.readFile(db, 'utf-8');
  const talkersParsed = JSON.parse(talkers);
  const talkersFiltered = talkersParsed.filter((talker) => talker.id !== Number(id));
  await fs.writeFile(db, JSON.stringify(talkersFiltered));
  return res.status(HTTP_NO_CONTENT).end();
  },
);

app.listen(PORT, () => {
  console.log('Online');
});
