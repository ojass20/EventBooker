const Event = require("./../models/eventModel");
const APIFeatures = require("./../utils/APIFeatures");

exports.getAllEvents = async (req, res, next) => {
  try {
    const features = new APIFeatures(Event.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const events = await features.query;

    res.status(200).json({
      status: "Success",
      results: events.length,
      data: {
        events: events,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "Fail",
      message: err,
    });
  }
};

exports.getEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(400).json({
        status: "Fail",
        message: "Invalid ID",
      });
    }
    res.status(200).json({
      status: "Success",
      data: {
        event: event,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "Fail",
      message: err,
    });
  }
};

exports.createEvent = async (req, res, next) => {
  try {
    const newEvent = await Event.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        event: newEvent,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "Fail",
      message: err,
    });
  }
};

exports.updateEvent = async (req, res, next) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!event) {
      return res.status(400).json({
        status: "Fail",
        message: "Invalid ID",
      });
    }
    res.status(200).json({
      status: "Success",
      data: {
        event: event,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "Fail",
      message: err,
    });
  }
};

exports.deleteEvent = async (req, res, next) => {
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.body);
    res.status(204).json({
      status: "success",
      message: "Following event has been successfully deleted",
      data: {
        event: deletedEvent,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "Fail",
      message: err,
    });
  }
};
