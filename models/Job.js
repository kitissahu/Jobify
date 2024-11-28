const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const jobSchema = new Schema({
  jobname: {
    type: String,
    required: true,
  },
  publishdate: {
    type: Date,
    required: true,
  },
  datelinedate: {
    type: Date,
    required: true,
  },
  vacancy: {
    type: Number,
    required: true,
  },
  salary: {
    type: Number,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  jobnature: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  qualification: {
    type: String,
    required: true,
  },
  companydetail: {
    type: String,
    required: true,
  },
  companyimg: {
    type: String,
  },
  file: {
    data: Buffer,
    contentType: String,
  },
  author: { type: Schema.Types.ObjectId, ref: "Recruiter" },
});

const JobModel = new mongoose.model("Job", jobSchema);

module.exports = JobModel;
