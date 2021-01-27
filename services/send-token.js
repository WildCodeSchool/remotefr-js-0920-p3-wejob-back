const mailer = require('./mailer');

async function sendToken(recipient, token) {
  const emailBuffer = Buffer.from(recipient, 'utf-8');
  const emailBase64 = emailBuffer.toString('base64');
  const link = `${process.env.FRONT_URL}/createAnAccount?token=${token}&email=${emailBase64}`;
  const text = `Merci de confirmer votre adresse e-mail en cliquant ici : ${link}`;
  const html = `<b><a href="${link}">Merci de confirmer votre adresse e-mail en cliquant ici.</a></b>`;
  const subject = "Confirmez votre adresse e-mail";

  return mailer(recipient, subject, text, html);
}

module.exports = sendToken;