const express = require("express");
const eventController = require("../controllers/eventController");
const authController = require(".././controllers/authController");
const reviewRouter = require("./reviewRoutes");

const router = express.Router();

router.use("/:eventId/reviews", reviewRouter);

router
  .route("/")
  .get(eventController.getAllEvents)
  .post(
    authController.protect,
    authController.restrictTo("admin", "manager"),
    eventController.createEvent,
  );

router
  .route("/:id")
  .get(eventController.getEvent)
  .patch(
    authController.protect,
    authController.restrictTo("admin", "manager"),
    eventController.updateEvent,
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin", "manager"),
    eventController.deleteEvent,
  );

module.exports = router;
