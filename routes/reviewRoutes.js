const express = require("express");
const reviewController = require("./../controllers/reviewController");
const authController = require("./../controllers/authController");

const router = express.Router({ mergeParams: true });

router.route("/").get(reviewController.getReviews).post(
  //   authController.restrictTo("user"),
  // reviewController.setEventUserIds,
  reviewController.createReview,
);

// router.route("/:id").get(reviewController.getReview);

module.exports = router;
