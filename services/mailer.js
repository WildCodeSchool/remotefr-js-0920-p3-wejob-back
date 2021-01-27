const nodemailer = require("nodemailer");
const senderName = process.env.MAIL_SENDER_NAME;
const senderEmail = process.env.MAIL_SENDER_EMAIL;
const sender = `"${senderName}" <${senderEmail}>`;

// async..await is not allowed in global scope, must use a wrapper
async function main(recipient, subject, text, html) {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD
    }
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: sender,
    to: recipient,
    subject: subject,
    text: text,
    html: html,
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

module.exports = main;