const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Event = require("./../models/eventModel");

dotenv.config({ path: `${__dirname}/../config.env` });
const DB = process.env.DATABASE.replace("<db_password>", process.env.PASSWORD);

mongoose.connect(DB).then(() => {
  console.log("DB connection successful");
});

const events = JSON.parse(
  fs.readFileSync(`${__dirname}/sampleEvents.json`, "utf-8"),
);

const importData = async () => {
  try {
    await Event.create(events);
    console.log("Data successfully loaded into database");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

const deleteData = async () => {
  try {
    await Event.deleteMany();
    console.log("Data successfully deleted from database");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}
console.log(process.argv);
