const mongoose = require("mongoose");
const slugify = require("slugify");
const validator = require("validator");
const Event = require("./eventModel");

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, "A review cannot be empty"],
      trim: true,
    },
    rating: {
      type: Number,
      required: [true, "A review needs a rating"],
      min: [1, "Rating cannot be less than 1"],
      max: [5, "Rating cannot be more than 5"],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: "Event",
      required: [true, "Review must belong to a event."],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Review must belong to a user."],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name photo",
  });
  next();
});

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
