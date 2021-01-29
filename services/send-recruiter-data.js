const mailer = require('./mailer');

async function sendRecruiterData(name, phone, email) {
  const recipient = process.env.MAIL_SENDER_KEEPWATCH;
  const subject = `Visite recruteur | ${name}`;
  const text = `Ce recruteur a consulté au moins un profil aujourd'hui : ${name} (${phone}, ${email})`;
  const html = `<p>Ce recruteur a consulté au moins un profil aujourd'hui&nbsp;:<br/><b>- ${name}<br/>- ${email}<br/>- ${phone}</b></a></p>`;

  return mailer(recipient, subject, text, html);
}

module.exports = sendRecruiterData;
