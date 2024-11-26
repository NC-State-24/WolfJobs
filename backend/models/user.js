// WolfJobs
// Copyright (c) 2024 Group 84: Gokul Prakash Ramesh, Haricharan Bharathi, Raghunandan Ganesh Mante
// This project is licensed under the MIT License.

// Governance Model:
// This project follows an open governance model, which includes a leadership team,
// contribution guidelines, a code of conduct, and a clear decision-making process.
// Contributions are welcome, and please see CONTRIBUTING.md for details.

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    isVerified: {
      type: Boolean,
      default: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
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
      type: Date,
    },
    gender: {
      type: String,
      default: "",
    },
    availability: {
      type: String,
      default: "",
    },
    affiliation: {
      type: String,
      default: "",
    },
    skills: {
      type: Array,
      default: [],
    },
    resume: {
      type: String,
      default: ""
    },
    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: 'Resume',
    },
    video: {
      type: String,
      default: "",
      ref: 'Video',
    },
	  videoId: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: 'Video',
      default: null
    }
  },
  {
    timestamps: true,
  }
);
userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

const User = mongoose.model("User", userSchema);

module.exports = User;
