const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const { default: helmet } = require("helmet");
require("dotenv/config");
const { authJwt } = require("./helpers/jwt");
const compression = require("compression");
require("aws-sdk/lib/maintenance_mode_message").suppress = true;

const app = express();

//routes
const userRouter = require("./routers/user.router");
const researcherRouter = require("./routers/researcher.router");
const studentRouter = require("./routers/student.router");

// CORS is a node.js package for providing a Connect/Express middlewares that can be used to enable CORS with various options.
app.use(cors());
app.options("*", cors);

// middlewares to Parse incoming request
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(compression());
// helmet for security
app.use(helmet());
// jwt auth
app.use(authJwt());

// for logging request
app.use(morgan("dev"));

// connect to database Mongo Atlas
mongoose
  .connect(process.env.CONNECTION_STRING, {})
  .then(() => {
    console.log("DB connection is ready");
  })
  .catch((err) => {
    console.error("DB connection failed:");
    console.log(err.message);
  });

// make folder uploads is a static folder
app.use("/public/uploads", express.static(__dirname + "/public/uploads"));

app.get("/", (req, res) => {
  res.send(" APIS FOR APP WORKING!!!");
});

// routes api
const api = process.env.API_URL;
app.use(`${api}/users`, userRouter);
app.use(`${api}/researchers`, researcherRouter);
app.use(`${api}/students`, studentRouter);

//Setup Error Handlers
const errorHandlers = require("./helpers/errorHandlers");
app.use(errorHandlers.notFound);
app.use(errorHandlers.mongoseErrors);
if (process.env.ENV === "DEVELOPMENT") {
  app.use(errorHandlers.developmentErrors);
} else {
  app.use(errorHandlers.productionErrors);
}

const port = process.env.PORT;
app.listen(port || 3000, () => {
  console.log(`express is working on port ${port}`);
});
