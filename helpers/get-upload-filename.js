const slug = require('slug');

// Calcul d'un faux "hash" basé sur l'id, converti en base36
function getUploadFilename(file, { id, lastname, firstname }) {
  const hash = (3000000 + id).toString(36);
  let ch = slug(`${hash} ${lastname} ${firstname} ${file.fieldname}`, '_');
  const ext = file.originalname.split('.');
  ch += `.${ext[ext.length - 1]}`;
  return ch;
}

module.exports = getUploadFilename;
