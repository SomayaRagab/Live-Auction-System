require('dotenv').config();
module.exports = {
  ENV: process.env.ENV,
  SECRET_KEY: process.env.SECRET_KEY,
  PORT: process.env.PORT,
  CLOUD_NAME: process.env.CLOUD_NAME,
  API_KEY: process.env.API_KEY,
  API_SECRET: process.env.API_SECRET,
  CLOUNINARY_URL: process.env.CLOUNINARY_URL,
  USERNAME: process.env.USERNAME,
  PASSWORD: process.env.PASSWORD,
  CONNECTION: process.env.CONNECTION,
};
