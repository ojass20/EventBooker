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
    event: {
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

reviewSchema.index({ event: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name photo",
  });
  next();
});

reviewSchema.statics.calcAverageRatings = async function (eventId) {
  const stats = await this.aggregate([
    {
      $match: { event: eventId },
    },
    {
      $group: {
        _id: "$event",
        nRating: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);
  if (stats.length > 0) {
    await Event.findByIdAndUpdate(eventId, {
      totalRatings: stats[0].nRating,
      averageRatings: stats[0].avgRating,
    });
  } else {
    await Event.findByIdAndUpdate(eventId, {
      totalRatings: 0,
      averageRatings: 4.5,
    });
  }
};

reviewSchema.post("save", function () {
  // this points to current review
  this.constructor.calcAverageRatings(this.event);
});

reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.clone().findOne();
  next();
});

reviewSchema.post(/^findOneAnd/, async function () {
  this.r.constructor.calcAverageRatings(this.r.event);
});

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
