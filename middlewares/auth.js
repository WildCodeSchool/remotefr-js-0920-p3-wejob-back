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

const extractJwtRecruiter = async (req) => {
  const { recruiter } = req.cookies;
  if (!recruiter) return null;
  try {
    const { iat, exp, ...decoded } = await jwt.verify(
      recruiter,
      process.env.JWT_SECRET,
    );
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

const checkCanReadCandidat = async (req, res, next) => {
  const user = await extractJwtUser(req);
  const candidatIdOrSlug = req.params.idOrSlug;
  const candidatIdNum = Number(candidatIdOrSlug);
  // to access a candidate by id you must
  // be authentified, be either an admin or the owner of the user_fiche
  const isAdmin = user && user.isAdmin;
  const isOwner = user && user.id === candidatIdNum;
  if (!Number.isNaN(candidatIdNum) && (isAdmin || isOwner)) {
    req.user = user;
    return next();
  }
  const recruiter = await extractJwtRecruiter(req);
  // allow only access by slug for non-admin (recruiters/public app)
  if (Number.isNaN(candidatIdNum) && recruiter) {
    return next();
  }
  return res.sendStatus(403);
};

module.exports = {
  checkJwtMw,
  checkIsAdmin,
  softCheckIsAdmin,
  checkCanUpdateCandidat,
  extractJwtRecruiter,
  checkCanReadCandidat,
};
