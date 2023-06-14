// packeges
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const fs = require('fs');

require('./Helper/scheduleUnblockUser');

// routes
const loginRoute = require('./Routes/loginRoute');
const auth = require('./Middleware/authentication');
const registrationRoute = require('./Routes/registrationRoute');
const userRoutes = require('./Routes/userRoute');
const itemRoutes = require('./Routes/itemRoute');
const auctionRoutes = require('./Routes/auctionRoute');
const bindingRoute = require('./Routes/bindingRoute');
const categoryRoutes = require('./Routes/categoryRoute');
const contactRoutes = require('./Routes/contactRoute');
const itemDetailsRoutes = require('./Routes/itemDetailsRoute');
const resetPasswordRoute = require('./Routes/resetPasswordRoute'); 

const { PORT, CONNECTION } = require('./Config/env');

//  open server using express
const server = express();
mongoose.set('strictQuery', true);
mongoose
  .connect(CONNECTION)
  .then(() => {
    console.log('DB connected');
    // listen port
    server.listen(PORT, () => {
      console.log('server is listening....', PORT);
    });
  })
  .catch((error) => {
    console.log('Db Problem ' + error);
  });

server.use(
  cors({
    origin: '*',
  })
);

morgan(function (tokens, request, res) {
  return [
    tokens.method(request, res),
    tokens.url(request, res),
    tokens.status(request, res),
    tokens.res(request, res, 'content-length'),
    '-',
    tokens['response-time'](request, res),
    'ms',
  ].join(' ');
});
morgan('dev');
server.use(express.json());
server.use(express.urlencoded({ extended: false }));

// login Route
server.use(resetPasswordRoute);
server.use(registrationRoute);
server.use(loginRoute);



// auth middleware
server.use(auth);

// Routes

server.use(userRoutes);
server.use(itemRoutes);
server.use(auctionRoutes);
server.use(itemDetailsRoutes);
// server.use( bindingRoute);
server.use(categoryRoutes);
server.use(contactRoutes);

// not found middleware
server.use((request, response, next) => {
  response.status(404).json({ message: 'page not found' });
});

// error middleware
server.use((error, request, response, next) => {
  if (request.file) fs.unlinkSync(request.file.path);
  let status = error.status || 500;
  response.status(status).json({ message: error + '' });
});
