const mongoose = require("mongoose");
const slugify = require("slugify");
const validator = require("validator");

const eventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "An event needs a name"],
      unique: true,
      trim: true,
      maxLength: [50, "An event name must be less than 50 characters"],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, "An event must have a duration"],
    },
    price: {
      type: Number,
      required: [true, "Please specify the price"],
    },
    locationType: {
      type: String,
      required: [true, "Please specify the location type"],
      enum: {
        values: ["Cafe", "Restaurant", "Sports Bar"],
        message:
          "Category can be one of the following : Cafe, Restaurant, Sports Bar",
      },
    },
    category: {
      type: String,
      required: [true, "Please specify the category"],
      enum: {
        values: ["Cricket", "Football", "Formula 1"],
        message:
          "Category can be one of the following : Cricket, Football, Formula 1",
      },
    },
    totalRatings: {
      type: Number,
      default: 0,
    },
    averageRatings: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be above 1.0"],
      max: [5, "Rating must be below 5.0"],
      set: (val) => Math.round(val * 10) / 10,
    },
    currentAttendees: {
      type: Number,
      default: 0,
    },
    maxAttendees: Number,
    startDateTime: Date,
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    imageCover: {
      type: String,
      required: [true, "An event must have a cover image"],
    },
    images: [String],
    description: {
      type: String,
      trim: true,
    },
    geoLocation: {
      // GeoJSON to specify Geospatial data
      type: {
        type: String,
        default: "Point",
        enum: ["Point"],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    contactPerson: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Implementing indexing to improve query performance
eventSchema.index({ price: 1, averageRatings: -1 });
eventSchema.index({ slug: 1 });
eventSchema.index({ geoLocation: "2dsphere" }); // Indexing for geospatial query and data

// Virtually populating reviews on events schema to avoid hitting the 16 MB memory limit on document size
eventSchema.virtual("reviews", {
  ref: "Review", // This is the model we are referencing here
  foreignField: "event", // What is the lookup field to this model called on that model
  localField: "_id", // The name of the field on this model which is referred there
});

eventSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

eventSchema.pre(/^find/, function (next) {
  this.populate({
    path: "contactPerson",
    select: "-__v -passwordChangedAt -passwordResetExpires -passwordResetToken",
  });
  next();
});

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
