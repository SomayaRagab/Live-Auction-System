const cloudinary = require('cloudinary').v2;

//clodinary configration
cloudinary.config({
  cloud_name: 'devnekpsn',
  api_key: '716982735537538',
  api_secret: 'DobujUPSTN5VO6Gjk8O4QoL0ZkI'
});

cloudinary.uploader.upload('./Images/download.jpeg', function(error, result) {
  //this will the image source
    console.log(result);
  });
  