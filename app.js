const fs = require("fs");
const express = require("express");
const morgan = require("morgan");

const AppError = require("./utils/appError");
const errorHandler = require("./controllers/errorController");

const eventRouter = require("./routes/eventRoutes");
const userRouter = require("./routes/userRoutes");

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
app.use("/api/v1/users/", userRouter);

app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl}`, 404));
});

app.use(errorHandler);

module.exports = app;
