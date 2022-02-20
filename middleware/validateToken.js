const { tokens } = require('./loginMiddleware');

const HTTP_UNAUTHORIZED = 401;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(HTTP_UNAUTHORIZED).json({ message: 'Token não encontrado' });
  } if (!(tokens.some((token) => token === authorization))) {
    return res.status(HTTP_UNAUTHORIZED).json({ message: 'Token inválido' });
  }

  next();
};
