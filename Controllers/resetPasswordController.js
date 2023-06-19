const sendEmail = require('./../Helper/sendEmail');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
require('./../Models/userModel');
const UserSchema = mongoose.model('users');

const generateResetPasswordToken = async (email) => {
  // Generate random token
  const token = (await bcrypt.genSalt(10)).replace(/\//g, '-');

  // Find user by email
  const user = await UserSchema.findOne({ email });
  if (!user) {
    return null;
  }

  // Set reset password token and expiration date
  user.resetPasswordToken = token;
  user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

  // Save user to database
  await user.save();

  return { token, name: user.name };
};

exports.sendResetPasswordEmail = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await generateResetPasswordToken(email);

    // If user doesn't exist, return error
    if (user === null) {
      return res.status(400).json({ message: 'User not found' });
    }
    // generate rondom 5 numbes for verify code and crypt it
    const verifyCode = Math.floor(10000 + Math.random() * 90000);
    const hashedVerifyCode = (
      await bcrypt.hash(verifyCode.toString(), 10)
    ).replace(/\//g, '-');

    // Send email with reset password link
    const resetPasswordLink = `http://localhost:3000/reset-password/code/${user.token}/${hashedVerifyCode}`;
    const emailSubject = 'Reset your password iBid website';
    const emailText = `<b>Dear ${user.name},</b> <br><br> You are receiving this email from <b>iBid website</b> because you (or someone else) have requested the reset of the password for your account.\n\n
          Please click on the following link, or paste this into your browser to complete the process:<br><br>
          ${resetPasswordLink}<br><br>
          Enter this code for verification: <b>${verifyCode}</b><br><br>
          If you did not request this, please ignore this email and your password will remain unchanged.<br><br> Best regards,<br> iBid website`;

    await sendEmail(email, emailSubject, emailText);

    res.json({ message: 'Email sent' });
  } catch (error) {
    next(error);
  }
};

exports.verifyResetPasswordToken = async (req, res, next) => {
  try {
    const { token, code } = req.params;

    // calculate req  numbers to number with 5 digits
    let codeNumber = '';
    codeNumber +=
      req.body.numberOne +
      req.body.numberTwo +
      req.body.numberThree +
      req.body.numberFour +
      req.body.numberFive;

    // Find user by reset password token and expiration date
    const user = await UserSchema.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    // If user doesn't exist or token is expired, return error
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // compare the code with the hashed code
    const matched = await bcrypt.compare(codeNumber, code.replace(/-/g, '/'));
    if (!matched) throw new Error('Wrong Verify Code');

    res.status(200).json({ message: 'Valid token' });
  } catch (error) {
    next(error);
  }
};

exports.updatePassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Find user by reset password token and expiration date
    const user = await UserSchema.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    // If user doesn't exist or token is expired, return error
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // Hash the new password and update the user's password field
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;

    // Clear the reset password fields
    user.resetPasswordToken = '';
    user.resetPasswordExpires = null;

    // Save user to database
    await user.save();
    // send email to user
    const emailSubject = 'Password updated';
    const emailText = `This is a confirmation that the password for your account ${user.email} has just been changed successfully.\n`;
    const email = user.email;
    await sendEmail(email, emailSubject, emailText);
    res.json({ message: 'Password updated Successfully' });
  } catch (error) {
    next(error);
  }
};
