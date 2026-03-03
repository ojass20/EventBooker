const Event = require("./../models/eventModel");
const APIFeatures = require("./../utils/APIFeatures");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

exports.getAllEvents = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Event.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const events = await features.query;
  // const events = await Event.find({});

  res.status(200).json({
    status: "Success",
    results: events.length,
    data: {
      events: events,
    },
  });
});

exports.getEvent = catchAsync(async (req, res, next) => {
  const event = await Event.findById(req.params.id);
  if (!event) {
    return next(new AppError("No event found with given ID", 404));
  }
  res.status(200).json({
    status: "Success",
    data: {
      event: event,
    },
  });
});

exports.createEvent = catchAsync(async (req, res, next) => {
  const newEvent = await Event.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      event: newEvent,
    },
  });
});

exports.updateEvent = catchAsync(async (req, res, next) => {
  const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!event) {
    return next(new AppError("No event found with given ID", 404));
  }
  res.status(200).json({
    status: "Success",
    data: {
      event: event,
    },
  });
});

exports.deleteEvent = catchAsync(async (req, res, next) => {
  const deletedEvent = await Event.findByIdAndDelete(req.params.id);
  if (!deletedEvent) {
    return next(new AppError("No event found with given ID", 404));
  }
  res.status(204).json({
    status: "success",
    message: "Following event has been successfully deleted",
    data: {
      event: deletedEvent,
    },
  });
});
