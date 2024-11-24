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
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
});

const Appointment = mongoose.model("Appointment", appointmentSchema);
  
module.exports = { Slot, Appointment };