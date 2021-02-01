const jwt = require('jsonwebtoken');

const privateKey = process.env.JWT_SECRET;

const checkJwtMw = async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) return res.sendStatus(401);
  try {
    const { iat, exp, ...decoded } = await jwt.verify(token, privateKey);
    req.user = decoded;
    return next();
  } catch (err) {
    return res.sendStatus(401);
  }
};

const checkIsAdmin = (req, res, next) =>
  checkJwtMw(req, res, () => {
    if (!req.user.isAdmin) return res.sendStatus(403);
    return next();
  });

const checkCanUpdateCandidat = (req, res, next) =>
  checkJwtMw(req, res, () => {
    const { id, isAdmin } = req.user;
    const candidatId = Number(req.params.id);
    return isAdmin || id === candidatId ? next() : res.sendStatus(403);
  });

module.exports = {
  checkJwtMw,
  checkIsAdmin,
  checkCanUpdateCandidat,
};
