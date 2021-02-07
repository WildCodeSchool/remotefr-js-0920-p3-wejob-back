const pool = require('../pool');

module.exports = async (req, res, next) => {
  if (!req.user) {
    console.error('getCandidateFields should be called AFTER checkJwtMw');
    return res.sendStatus(401);
  }
  const userId = req.params.id;
  if (!userId) {
    console.error('No candidate id in params');
    return res.sendStatus(400);
  }
  try {
    // si l'id candidat est dans les params on le prend, sinon on prend l'user.
    // pas sur que ce soit utile
    const [
      [candidat],
    ] = await pool.query(
      'SELECT user_id AS id, firstname, lastname FROM user_fiche WHERE user_id = ?',
      [userId],
    );
    req.candidate = candidat;
    return next();
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: `Error: "${err.message}" while retrieving candidate fields`,
    });
  }
};
