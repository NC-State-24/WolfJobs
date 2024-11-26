// WolfJobs
// Copyright (c) 2024 Group 84: Gokul Prakash Ramesh, Haricharan Bharathi, Raghunandan Ganesh Mante
// This project is licensed under the MIT License.

// Governance Model:
// This project follows an open governance model, which includes a leadership team,
// contribution guidelines, a code of conduct, and a clear decision-making process.
// Contributions are welcome, and please see CONTRIBUTING.md for details.

const Shift = require('../models/shift'); // Import the Shift model
const User = require('../models/user'); // Import the User model

// Check-in function
exports.checkIn = async (req, res) => {

    console.log("Headers:", req.headers);
    console.log("Body:", req.body);
    console.log("Files:", req.files);
    let user = await User.findOne({ _id: req.body.id });
    const checkInTime = new Date();
    const checkOutTime = new Date(checkInTime);
    checkOutTime.setHours(22, 0, 0, 0); // Set to 10 PM
    try {
        const shift = new Shift({
            applicantId: user._id,
            checkIn: checkInTime,
            checkOut: checkOutTime, // Initially set to 10 PM
            duration: 0, // Duration will be calculated on checkout
        });

        await shift.save();
        res.status(201).json({ message: "Checked in successfully", shift });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error checking in", error });
    }
};

// Check-out function
exports.checkOut = async (req, res) => {
    console.log(req.body);

    try {
        const today = new Date();
        today.setHours(22, 0, 0, 0); // Set to 10 PM
        const shift = await Shift.findOne({ applicantId: req.body.id, duration: 0 });
        //     const shift = await Shift.findOne({ applicantId, checkOut: null }); // Find current active shift

        if (!shift) {
            return res.status(404).json({ message: "No active shift found" });
        }

        const now = new Date();
        shift.checkOut = now;
        shift.duration = Number(((now - shift.checkIn) / 3600000).toFixed(2)); // Calculate duration in minutes
        await shift.save();
        res.status(200).json({ message: "Checked out successfully", shift });
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Error checking out", error });
    }
};

// Check if there's an active shift for the user
exports.getActiveShift = async (req, res) => {
    try {
        const shift = await Shift.findOne({ applicantId: req.params.id, duration: 0 });

        if (shift) {
            return res.status(200).json({ isActive: true, shift });
        }
        return res.status(200).json({ isActive: false });
    } catch (error) {
        console.error('Error fetching active shift:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getAllShifts = async (req, res) => {
    try {
        const shifts = await Shift.find({});
        console.log(`Shifts size ${shifts.length}`);
        res.json(shifts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching all shifts' });
    }
}

exports.getApplicantShifts = async (req, res) => {

    try {
        const shifts = await Shift.find({ applicantId: req.params.id });
        console.log(`Shifts size ${shifts.length}`);
        res.json(shifts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching applicant shifts' });
    }
};

