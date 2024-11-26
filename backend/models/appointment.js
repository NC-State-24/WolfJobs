// WolfJobs
// Copyright (c) 2024 Group 84: Gokul Prakash Ramesh, Haricharan Bharathi, Raghunandan Ganesh Mante
// This project is licensed under the MIT License.

// Governance Model:
// This project follows an open governance model, which includes a leadership team,
// contribution guidelines, a code of conduct, and a clear decision-making process.
// Contributions are welcome, and please see CONTRIBUTING.md for details.

const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({
    recruiterId: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    startTime: {
        type: String,
        required: true,
    },
    endTime: {
        type: String,
        required: true,
    },
    isBooked: {
        type: Boolean,
        default: false,
    },
});

const Slot = mongoose.model("Slot", slotSchema);

const appointmentSchema = new mongoose.Schema({
    slotId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Slot",
      required: true,
    },
    applicantId: {
      type: String,
      required: true,
    },
    managerId: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
    startTime: {
        type: String,
        required: true,
    },
    endTime: {
        type: String,
        required: true,
    },
    // status: {
    //   type: String,
    //   enum: ["Pending", "Approved", "Rejected"],
    //   default: "Pending",
    // },
});

const Appointment = mongoose.model("Appointment", appointmentSchema);
  
module.exports = { Slot, Appointment };