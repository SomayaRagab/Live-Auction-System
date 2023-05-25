require("dotenv").config();
module.exports = {
  ENV: process.env.ENV,
  SECRET_KEY: process.env.SECRET_KEY,
  PORT: process.env.PORT
};