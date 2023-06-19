const nodemailer = require('nodemailer');
const { MY_EMAIL, PASSWORD_EMAIL } = require('./../Config/env');

// console.log(MY_EMAIL, PASSWORD_EMAIL);
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: MY_EMAIL,
    pass: PASSWORD_EMAIL,
  },
});

const sendEmail = async (to, subject, text ) => {
  const mailOptions = {
    to,
    from: MY_EMAIL,
    subject,
    html:text,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
   console.error(error);
  }
};

module.exports = sendEmail;
