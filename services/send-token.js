const mailer = require('./mailer');
const getTemplate = require('./get-template');

async function sendToken(recipient, token) {
  const template = getTemplate('create-first-password');
  const emailBuffer = Buffer.from(recipient, 'utf-8');
  const emailBase64 = emailBuffer.toString('base64');
  const link = `${process.env.ADMIN_APP_URL}/creation-compte?token=${token}&email=${emailBase64}`;
  const backendURL = process.env.BACKEND_URL;
  const text = `Vous avez désormais un compte We-Job. Merci de confirmer votre adresse e-mail en cliquant ici : ${link}`;
  const html = template({ link, backendURL });
  const subject = 'Confirmez votre adresse e-mail';

  return mailer(recipient, subject, text, html);
}

module.exports = sendToken;
