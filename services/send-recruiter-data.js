const mailer = require('./mailer');
const getTemplate = require('./get-template');

async function sendRecruiterData(name, phone, email) {
  const template = getTemplate('visit-recruiter');
  const recipient = process.env.MAIL_SENDER_KEEPWATCH;
  const subject = `Visite recruteur | ${name}`;
  const text = `Ce recruteur a consulté au moins un profil aujourd'hui : ${name} (${phone}, ${email})`;
  const html = template({ name, phone, email });

  return mailer(recipient, subject, text, html);
}

module.exports = sendRecruiterData;