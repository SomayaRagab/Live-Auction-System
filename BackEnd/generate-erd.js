const mongooseErd = require('mongoose-erd-generator');

mongooseErd.generate('./diagram.png', './erd.json')
  .then(() => {
    console.log('ERD diagram generated successfully!');
  })
  .catch((err) => {
    console.error('Failed to generate ERD diagram:', err);
  });