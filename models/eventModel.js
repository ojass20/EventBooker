const mongoose = require("mongoose");
const slugify = require("slugify");
const validator = require("validator");

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "An event needs a name"],
    unique: true,
    trim: true,
    maxLength: [50, "An event name must be less than 50 characters"],
  },
  slug: String,
  price: {
    type: Number,
    required: [true, "Please specify the price"],
  },
  location: {
    type: String,
    required: [true, "Please specify the location"],
  },
  category: {
    type: String,
    required: [true, "Please specify the category"],
    enum: {
      values: [
        "concert",
        "workshop",
        "conference",
        "meetup",
        "sports",
        "comedy",
      ],
      message: [
        "Category can be one of the following : Concert, Workshop, Conference, Meetup, Sports, Comedy",
      ],
    },
  },
  currentAttendees: {
    type: Number,
    default: 0,
  },
  maxAttendees: Number,
  startDate: Date,
  endDate: Date,
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
  imageCover: {
    type: String,
    required: [true, "An event must have a cover image"],
  },
  description: {
    type: String,
    trim: true,
  },
  organiser: {
    type: String,
    required: [true, "Please specify the organiser"],
  },
});

eventSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
