require("dotenv").config();
const mongoose = require("mongoose");

module.exports = async () => {
  try {
    await mongoose.connect(
      process.env.MONG0_URL,
    );
    console.log("Connected to database.");
  } catch (error) {
    console.log(error);
    console.log("Could not connect to database.");
  }
};
