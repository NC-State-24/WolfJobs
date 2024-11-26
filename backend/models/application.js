// WolfJobs
// Copyright (c) 2024 Group 84: Gokul Prakash Ramesh, Haricharan Bharathi, Raghunandan Ganesh Mante
// This project is licensed under the MIT License.

// Governance Model:
// This project follows an open governance model, which includes a leadership team,
// contribution guidelines, a code of conduct, and a clear decision-making process.
// Contributions are welcome, and please see CONTRIBUTING.md for details.

const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  jobid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
  },
  jobname: {
    type: String,
    required: true,
  },
  applicantid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  applicantname: {
    type: String,
    required: true,
    default: "",
  },
  applicantemail: {
    type: String,
    default: "",
  },
  applicantskills: {
    type: Array,
    default: [],
  },
  phonenumber: {
    type: String,
    default: "",
  },
  managerid: {
    type: String,
    default: "",
  },
  address: {
    type: String,
    default: "",
  },
  phonenumber: {
    type: String,
    default: "",
  },
  hours: {
    type: String,
    default: "",
  },
  dob: {
    type: String,
    default: "",
  },
  gender: {
    type: String,
    default: "",
  },
  status: {
    type: String,
    default: "applied",
  },
  jobname: {
    type: String,
    required: true,
  },
  jobid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
  },
  answer1: {
    type: String,
    default: "",
  },
  answer2: {
    type: String,
    default: "",
  },
  answer3: {
    type: String,
    default: "",
  },
  answer4: {
    type: String,
    default: "",
  },
  rating: {
    type: String,
    default: "",
  },
});

const Application = mongoose.model("Application", applicationSchema);

module.exports = Application;
