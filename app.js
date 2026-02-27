const fs = require("fs");
const express = require("express");
const morgan = require("morgan");

const eventRouter = require("./routes/eventRoutes");

const app = express();
app.set("query parser", "extended");

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(express.json());

app.use((req, res, next) => {
  console.log("Hello from the Event Booker app middleware!");
  next();
});

app.use("/api/v1/events/", eventRouter);

module.exports = app;
