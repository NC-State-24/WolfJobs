// WolfJobs
// Copyright (c) 2024 Group 84: Gokul Prakash Ramesh, Haricharan Bharathi, Raghunandan Ganesh Mante
// This project is licensed under the MIT License.

// Governance Model:
// This project follows an open governance model, which includes a leadership team,
// contribution guidelines, a code of conduct, and a clear decision-making process.
// Contributions are welcome, and please see CONTRIBUTING.md for details.

// controllers/appointment_controller.js
const {Slot, Appointment} = require("../models/appointment");

// Controller for creating a new slot
exports.createSlot = async (req, res) => {
    try {
        const { recruiterId, date, startTime, endTime } = req.body;
        const slot = new Slot({
        recruiterId,
        date,
        startTime,
        endTime,
        isBooked: false,
        });

        await slot.save();
        res.status(201).send({ message: 'Slot created successfully', slot });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
};

// Controller for retrieving available slots
exports.getAvailableSlots = async (req, res) => {
    try {
        const slots = await Slot.find({ isBooked: false });
        if (slots.length === 0) {
        return res.status(404).send({ message: 'No available slots found' });
        }
        res.status(200).send(slots);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
};

// Controller for booking an appointment
exports.bookAppointment = async (req, res) => {
    try {
        const { slotId, applicantId } = req.body;

        // Find the slot and ensure it is available
        const slot = await Slot.findById(slotId);
        if (!slot || slot.isBooked) {
        return res.status(404).send({ error: 'Slot not available' });
        }

        // Create the appointment
        const appointment = new Appointment({
        slotId,
        applicantId,
        status: 'Pending',
        });

        // Mark the slot as booked
        slot.isBooked = true;
        await slot.save();
        await appointment.save();

        res.status(201).send({ message: 'Appointment booked successfully', appointment });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
};

// Controller for retrieving an applicant's appointments
exports.getAppointmentsByApplicant = async (req, res) => {
    try {
        const { id } = req.params; // Applicant ID
        const appointments = await Appointment.find({ applicantId: id }).populate('slotId');

        if (!appointments || appointments.length === 0) {
        return res.status(404).send({ message: 'No appointments found' });
        }

        res.status(200).send(appointments);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
};

// Controller for updating appointment status
exports.updateAppointmentStatus = async (req, res) => {
    try {
        const { id } = req.params; // Appointment ID
        const { status } = req.body; // New status

        // Find and update the appointment
        const appointment = await Appointment.findByIdAndUpdate(
        id,
        { status },
        { new: true }
        );

        if (!appointment) {
        return res.status(404).send({ error: 'Appointment not found' });
        }

        res.status(200).send({ message: 'Appointment status updated', appointment });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
};
  