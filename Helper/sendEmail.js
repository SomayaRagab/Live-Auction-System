const nodemailer = require('nodemailer');
const { MY_EMAIL, EMAIL_PASSWORD, EMAIL_PORT } = require('./../Config/env');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: EMAIL_PORT,
  secure: true,
  auth: {
    user: MY_EMAIL,
    pass: EMAIL_PASSWORD,
  },
});

const sendEmail = async (to, subject, text) => {
  const mailOptions = {
    to,
    from: MY_EMAIL,
    subject,
    html: text,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error(error);
  }
};

module.exports = sendEmail;
