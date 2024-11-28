const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const RecruiterSchema = new Schema({
  recruitername: {
    type: String,
    required: true,
    min: 4,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  contact: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        return /^\d{10}$/.test(value);
      },
      message: "Contact must have exactly 10 numeric characters",
    },
  },
});

const RecruiterModel = new mongoose.model("Recruiter", RecruiterSchema);

module.exports = RecruiterModel;
