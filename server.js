const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: `${__dirname}/config.env` });

const DB = process.env.DATABASE.replace("<db_password>", process.env.PASSWORD);
const app = require("./app");
mongoose.connect(DB).then(() => {
  console.log("Connection to database successful!");
});

const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
  console.log(`App is running on port ${port}...`);
});
