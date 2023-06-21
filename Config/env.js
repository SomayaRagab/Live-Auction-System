require('dotenv').config();
module.exports = {
  PORT: process.env.PORT ,
  SECRET_KEY:process.env.API_KEY,
  CLOUD_NAME:process.env.CLOUD_NAME,
  API_KEY:process.env.API_KEY,
  API_SECRET:process.env.API_SECRET,
  CLOUNINARY_URL:process.env.CLOUNINARY_URL,
  USERNAME:process.env.USERNAME,
  PASSWORD:process.env.PASSWORD,
  CONNECTION:process.env.CONNECTION,
  MY_EMAIL : process.env.MY_EMAIL,
  PASSWORD_EMAIL : process.env.PASSWORD_EMAIL,
};
