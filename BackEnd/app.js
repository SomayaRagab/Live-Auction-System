// packeges
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
const fs = require("fs");

// routes
const loginRoutes = require("./Routes/loginRoute");
const userRoutes = require("./Routes/userRoute");
const itemRoutes = require("./Routes/itemRoute");
const auctionRoutes = require("./Routes/auctionRoute");
const bindingRoute = require("./Routes/bindingRoute");
const categoryRoutes = require("./Routes/categoryRoute"); 
const contactRoutes = require("./Routes/contactRoute");

const { PORT } = require("./Config/env");




//  open server using express
const server = express(); 
let port = PORT;
mongoose.set("strictQuery", true);
mongoose
  .connect(
    "mongodb+srv://nabila:%40Auctions123@auctions.7ds6w6l.mongodb.net/"
  )
  .then(() => {
    console.log("DB connected");
    // listen port
    server.listen(port, () => {
      console.log("server is listening....", port);
    });
  })
  .catch((error) => {
    console.log("Db Problem " + error);
  });

server.use(
  cors({
    origin: "*",
  })
);


morgan(function (tokens, request, res) {
  return [
    tokens.method(request, res),
    tokens.url(request, res),
    tokens.status(request, res),
    tokens.res(request, res, "content-length"),
    "-",
    tokens["response-time"](request, res),
    "ms",
  ].join(" ");
});
morgan("dev");
server.use(express.json());
server.use(express.urlencoded({ extended: false }));

// login Route

// server.use(loginRoutes);

// auth middleware





// Routes

// server.use(userRoutes);
// server.use( itemRoutes);
// server.use(auctionRoutes);
// server.use( bindingRoute);
// server.use( categoryRoutes);
// server.use(contactRoutes);


// not found middleware
server.use((request, response, next) => {
  response.status(404).json({ message: "page not found" });
});

// error middleware
server.use((error, request, response, next) => {
  if (request.file) fs.unlinkSync(request.file.path);
  let status = error.status || 500;
  response.status(status).json({ message: error + "" });
});
