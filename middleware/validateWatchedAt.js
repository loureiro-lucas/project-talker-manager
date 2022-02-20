const HTTP_BAD_REQUEST = 400;

module.exports = (req, res, next) => {
  const { talk: { watchedAt } } = req.body;
  const dateRegex = /^(0[1-9]|1\d|2\d|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/;

  if (!(dateRegex.test(watchedAt))) {
    return res.status(HTTP_BAD_REQUEST)
      .json({ message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"' });
  }

  next();
};
