const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Event = require("../models/eventModel");
const User = require("./../models/userModel");
const Review = require("./../models/reviewModel");

dotenv.config({ path: `${__dirname}/../config.env` });
const DB = process.env.DATABASE.replace("<db_password>", process.env.PASSWORD);

mongoose.connect(DB).then(() => {
  console.log("DB connection successful");
});

const events = JSON.parse(
  fs.readFileSync(`${__dirname}/sampleEvents.json`, "utf-8"),
);
const users = JSON.parse(
  fs.readFileSync(`${__dirname}/sampleUsers.json`, "utf-8"),
);
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/sampleReviews.json`, "utf-8"),
);

const importEventData = async () => {
  try {
    await Event.create(events);
    console.log("Data successfully loaded into database");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

const deleteEventData = async () => {
  try {
    await Event.deleteMany();
    console.log("Data successfully deleted from database");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// Import Data into DB
const importUserData = async () => {
  try {
    await User.create(users, { validateBeforeSave: false });
    console.log("Data successfully loaded");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// Delete all data from collection
const deleteUserData = async () => {
  try {
    await User.deleteMany();
    console.log("Data successfully deleted");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// Import Data into DB
const importReviewData = async () => {
  try {
    await Review.create(reviews);
    console.log("Data successfully loaded");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// Delete all data from collection
const deleteReviewData = async () => {
  try {
    await Review.deleteMany();
    console.log("Data successfully deleted");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === "--importEvent") {
  importEventData();
} else if (process.argv[2] === "--deleteEvent") {
  deleteEventData();
} else if (process.argv[2] === "--importUser") {
  importUserData();
} else if (process.argv[2] === "--deleteUser") {
  deleteUserData();
} else if (process.argv[2] === "--importReview") {
  importReviewData();
} else if (process.argv[2] === "--deleteReview") {
  deleteReviewData();
}
console.log(process.argv);
