const cloudinary = require('cloudinary').v2;
const { CLOUD_NAME , API_KEY , API_SECRET } = require("../Config/env");


//clodinary configration
module.exports= cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET
});

// cloudinary.uploader.upload('./Images/download.jpeg', function(error, result) {
//   //this will the image source
//     console.log(result);
//   });
  