const mongoose = require("mongoose");

const shiftSchema = new mongoose.Schema({
    applicantId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    checkIn: {
        type: Date,
        required: true,
    },
    checkOut: {
        type: Date,
        required: true,
    },
    duration: {
        type: Number, // Duration in hours
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

const Shift = mongoose.model("Shift", shiftSchema);
module.exports = Shift;