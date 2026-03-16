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
