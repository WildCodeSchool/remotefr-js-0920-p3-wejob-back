const jwt = require('jsonwebtoken');

const privateKey = process.env.JWT_SECRET;

const extractJwtUser = async (req) => {
  const { token } = req.cookies;
  if (!token) return null;
  try {
    const { iat, exp, ...decoded } = await jwt.verify(token, privateKey);
    return decoded;
  } catch (err) {
    return null;
  }
};

const checkJwtMw = async (req, res, next) => {
  const user = await extractJwtUser(req);
  if (!user) return res.sendStatus(401);
  req.user = user;
  return next();
};

const checkIsAdmin = (req, res, next) =>
  checkJwtMw(req, res, () => {
    if (!req.user.isAdmin) return res.sendStatus(403);
    return next();
  });

const softCheckIsAdmin = async (req, res, next) => {
  req.user = await extractJwtUser(req);
  return next();
};

const checkCanUpdateCandidat = (req, res, next) =>
  checkJwtMw(req, res, () => {
    const { id, isAdmin } = req.user;
    const candidatId = Number(req.params.id);
    return isAdmin || id === candidatId ? next() : res.sendStatus(403);
  });

module.exports = {
  checkJwtMw,
  checkIsAdmin,
  softCheckIsAdmin,
  checkCanUpdateCandidat,
};
