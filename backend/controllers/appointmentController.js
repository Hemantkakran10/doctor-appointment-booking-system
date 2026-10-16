import Appointment from '../models/Appointment.js';
import Doctor from '../models/Doctor.js';

// @desc    Book a new appointment
// @route   POST /api/appointments
// @access  Private/Patient
export const bookAppointment = async (req, res) => {
  const { docId, slotDate, slotTime } = req.body;

  try {
    if (!docId || !slotDate || !slotTime) {
      return res.status(400).json({ message: 'Please provide doctor, date, and slot time' });
    }

    const doctor = await Doctor.findById(docId);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    if (!doctor.isActive) {
      return res.status(400).json({ message: 'Doctor is currently not accepting appointments' });
    }

    // Initialize or read booked slots for date
    let bookedSlots = doctor.slots_booked.get(slotDate) || [];

    // Double-booking check
    if (bookedSlots.includes(slotTime)) {
      return res.status(400).json({ message: 'This time slot is already booked' });
    }

    // Create the appointment
    const appointment = await Appointment.create({
      userId: req.user._id,
      docId,
      slotDate,
      slotTime,
      amount: doctor.fees
    });

    // Update doctor's slots_booked
    bookedSlots.push(slotTime);
    doctor.slots_booked.set(slotDate, bookedSlots);
    await doctor.save();

    return res.status(201).json(appointment);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Get patient's appointments
// @route   GET /api/appointments/my
// @access  Private/Patient
export const getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ userId: req.user._id })
      .populate('docId', 'name specialization degree fees')
      .sort({ slotDate: -1, slotTime: -1 });
    return res.json(appointments);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel an appointment (Patient)
// @route   PUT /api/appointments/:id/cancel
// @access  Private/Patient
export const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Verify ownership
    if (appointment.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    if (appointment.isCompleted) {
      return res.status(400).json({ message: 'Cannot cancel a completed appointment' });
    }

    if (appointment.cancelled) {
      return res.status(400).json({ message: 'Appointment already cancelled' });
    }

    // Perform cancellation
    appointment.cancelled = true;
    await appointment.save();

    // Release slot in Doctor schema
    const doctor = await Doctor.findById(appointment.docId);
    if (doctor) {
      const bookedSlots = doctor.slots_booked.get(appointment.slotDate) || [];
      const updatedSlots = bookedSlots.filter(slot => slot !== appointment.slotTime);
      
      if (updatedSlots.length === 0) {
        doctor.slots_booked.delete(appointment.slotDate);
      } else {
        doctor.slots_booked.set(appointment.slotDate, updatedSlots);
      }
      await doctor.save();
    }

    return res.json({ message: 'Appointment cancelled successfully', appointment });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Mark appointment completed (Doctor)
// @route   PUT /api/appointments/:id/complete
// @access  Private/Doctor
export const completeAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Verify doctor ownership
    if (appointment.docId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    if (appointment.cancelled) {
      return res.status(400).json({ message: 'Cannot complete a cancelled appointment' });
    }

    appointment.isCompleted = true;
    await appointment.save();

    return res.json({ message: 'Appointment marked as completed', appointment });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel appointment (Doctor)
// @route   PUT /api/appointments/:id/doctor-cancel
// @access  Private/Doctor
export const cancelDoctorAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Verify doctor ownership
    if (appointment.docId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    if (appointment.isCompleted) {
      return res.status(400).json({ message: 'Cannot cancel a completed appointment' });
    }

    if (appointment.cancelled) {
      return res.status(400).json({ message: 'Appointment already cancelled' });
    }

    // Perform cancellation
    appointment.cancelled = true;
    await appointment.save();

    // Release slot in Doctor schema
    const doctor = await Doctor.findById(appointment.docId);
    if (doctor) {
      const bookedSlots = doctor.slots_booked.get(appointment.slotDate) || [];
      const updatedSlots = bookedSlots.filter(slot => slot !== appointment.slotTime);

      if (updatedSlots.length === 0) {
        doctor.slots_booked.delete(appointment.slotDate);
      } else {
        doctor.slots_booked.set(appointment.slotDate, updatedSlots);
      }
      await doctor.save();
    }

    return res.json({ message: 'Appointment cancelled successfully by doctor', appointment });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
