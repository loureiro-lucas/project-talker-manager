const HTTP_BAD_REQUEST = 400;

module.exports = (req, res, next) => {
  const { talk: { rate } } = req.body;

  if (rate < 1 || rate > 5) {
    return res.status(HTTP_BAD_REQUEST)
      .json({ message: 'O campo "rate" deve ser um inteiro de 1 à 5' });
  }

  next();
};
