const mailer = require('./mailer');
const getTemplate = require('./get-template');

async function sendToken(recipient, token) {
  const template = getTemplate('forgot-password');
  const link = `${process.env.ADMIN_APP_URL}/mot-de-passe-oublie?token=${token}`;
  const backendURL = process.env.BACKEND_URL;
  const text = `Bonjour, ceci est un e-mail automatique envoyé à la suite d'un clic sur "mot de passe oublié", sur le site We-Job. Cliquez sur ce lien pour créer un nouveau mot de passe : ${link}. Si vous n'avez pas demandé la réinitialisation de votre mot de passe, vous pouvez ignorer cet email.`;
  const html = template({ link, backendURL });
  const subject = 'Mot de passe oublié ?';

  return mailer(recipient, subject, text, html);
}

module.exports = sendToken;
