const randToken = require('rand-token');

const HTTP_OK_STATUS = 200;

const tokens = [];

const login = (_req, res, _next) => {
  const token = randToken.generate(16);
  tokens.push(token);
  return res.status(HTTP_OK_STATUS).json({ token });
};

module.exports = { login, tokens };
