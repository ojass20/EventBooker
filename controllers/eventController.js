const Event = require("../models/eventModel.js");
const APIFeatures = require("./../utils/APIFeatures");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const factory = require("./handlerFactory.js");

exports.getAllEvents = factory.getAll(Event);
exports.createEvent = factory.createOne(Event);
exports.getEvent = factory.getOne(Event, { path: "reviews" });
exports.updateEvent = factory.updateOne(Event);
exports.deleteEvent = factory.deleteOne(Event);

exports.getEventsWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(",");

  if (!lat || !lng) {
    next(
      new AppError(
        "Please provide latitude & longitude in the format lat,lng",
        400,
      ),
    );
  }
  const radius = unit === "mi" ? distance / 3963.2 : distance / 6378.1;
  const events = await Event.find({
    geoLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res.status(200).json({
    status: "success",
    results: events.length,
    data: {
      data: events,
    },
  });
});
