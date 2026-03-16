const fs = require("fs");
const express = require("express");
const morgan = require("morgan");

const AppError = require("./utils/appError");
const errorHandler = require("./controllers/errorController");

const rateLimiter = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");

const eventRouter = require("./routes/eventRoutes");
const userRouter = require("./routes/userRoutes");

const app = express();
app.set("query parser", "extended"); // In Express 5, we need to set this so that we can parse complex queries in API URLs

// Middleware to make req.query propertly of request mutable, by default in Express 5, this property is immutable
// so it is not possible to use security middleware directly on req.query as they modify the request parameters
app.use((req, res, next) => {
  const rawQuery = { ...req.query };
  Object.defineProperty(req, "query", {
    value: rawQuery,
    writable: true,
    enumerable: true,
    configurable: true,
  });
  next();
});

// Set Security HTTP headers
app.use(helmet());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Middleware for rate limiting
const limiter = rateLimiter({
  max: 100, // No. of requests from same IP
  window: 60 * 60 * 1000, // Time frame in ms
  message:
    "Too many incomming requests from this IP, please try again after 1 hour",
});
app.use("/api", limiter);

app.use(express.json({ limit: "10kb" })); // Middleware for requests to POST method

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter polution
app.use(hpp());

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
