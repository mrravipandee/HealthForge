import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";

// API for doctor Login 
const loginDoctor = async (req, res) => {

    try {

        const { email, password } = req.body
        const user = await doctorModel.findOne({ email })

        if (!user) {
            return res.json({ success: false, message: "Invalid credentials" })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
            res.json({ success: true, token })
        } else {
            res.json({ success: false, message: "Invalid credentials" })
        }


    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get doctor appointments for doctor panel
const appointmentsDoctor = async (req, res) => {
    try {

        const { docId } = req.body
        const appointments = await appointmentModel.find({ docId })

        res.json({ success: true, appointments })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to cancel appointment for doctor panel
const appointmentCancel = async (req, res) => {
    try {

        const { docId, appointmentId } = req.body

        const appointmentData = await appointmentModel.findById(appointmentId)
        if (appointmentData && appointmentData.docId === docId) {
            await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })
            return res.json({ success: true, message: 'Appointment Cancelled' })
        }

        res.json({ success: false, message: 'Appointment Cancelled' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API to mark appointment completed for doctor panel
const appointmentComplete = async (req, res) => {
    try {

        const { docId, appointmentId } = req.body

        const appointmentData = await appointmentModel.findById(appointmentId)
        if (appointmentData && appointmentData.docId === docId) {
            await appointmentModel.findByIdAndUpdate(appointmentId, { isCompleted: true })
            return res.json({ success: true, message: 'Appointment Completed' })
        }

        res.json({ success: false, message: 'Appointment Cancelled' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API to get all doctors list for Frontend
const doctorList = async (req, res) => {
    try {

        const doctors = await doctorModel.find({}).select(['-password', '-email'])
        res.json({ success: true, doctors })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API to change doctor availablity for Admin and Doctor Panel
const changeAvailablity = async (req, res) => {
    try {

        const { docId } = req.body

        const docData = await doctorModel.findById(docId)
        await doctorModel.findByIdAndUpdate(docId, { available: !docData.available })
        res.json({ success: true, message: 'Availablity Changed' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get doctor profile for  Doctor Panel
const doctorProfile = async (req, res) => {
    try {

        const { docId } = req.body
        const profileData = await doctorModel.findById(docId).select('-password')

        res.json({ success: true, profileData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to update doctor profile data from  Doctor Panel
const updateDoctorProfile = async (req, res) => {
    try {

        const { docId, fees, address, available } = req.body

        await doctorModel.findByIdAndUpdate(docId, { fees, address, available })

        res.json({ success: true, message: 'Profile Updated' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get dashboard data for doctor panel
const doctorDashboard = async (req, res) => {
    try {

        const { docId } = req.body

        const appointments = await appointmentModel.find({ docId })

        let earnings = 0

        appointments.map((item) => {
            if (item.isCompleted || item.payment) {
                earnings += item.amount
            }
        })

        let patients = []

        appointments.map((item) => {
            if (!patients.includes(item.userId)) {
                patients.push(item.userId)
            }
        })



        const dashData = {
            earnings,
            appointments: appointments.length,
            patients: patients.length,
            latestAppointments: appointments.reverse()
        }

        res.json({ success: true, dashData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get all available specializations
const getSpecializations = async (req, res) => {
    try {
        const specializations = await doctorModel.distinct('speciality');
        res.json({ 
            success: true, 
            specializations: specializations.filter(spec => spec) // Remove null/undefined values
        });
    } catch (error) {
        console.error('Error fetching specializations:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// API to get doctors by specialization
const getDoctorsBySpecialization = async (req, res) => {
    try {
        const { specialization } = req.params;
        
        if (!specialization) {
            return res.status(400).json({ 
                success: false, 
                message: 'Specialization is required' 
            });
        }

        const doctors = await doctorModel.find({ 
            speciality: specialization,
            available: true 
        }).select('-password');

        res.json({ 
            success: true, 
            doctors,
            count: doctors.length
        });
    } catch (error) {
        console.error('Error fetching doctors by specialization:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// API to get available slots for a doctor on a specific date
const getAvailableSlots = async (req, res) => {
    try {
        const { doctorId } = req.params;
        const { date } = req.query;

        if (!doctorId || !date) {
            return res.status(400).json({ 
                success: false, 
                message: 'Doctor ID and date are required' 
            });
        }

        // Check if doctor exists and is available
        const doctor = await doctorModel.findById(doctorId);
        if (!doctor) {
            return res.status(404).json({ 
                success: false, 
                message: 'Doctor not found' 
            });
        }

        if (!doctor.available) {
            return res.status(400).json({ 
                success: false, 
                message: 'Doctor is not available' 
            });
        }

        // Get existing appointments for this doctor on the selected date
        const existingAppointments = await appointmentModel.find({
            doctorId: doctorId,
            date: date,
            status: { $nin: ['cancelled', 'completed'] }
        });

        // Generate all possible time slots (9 AM to 6 PM, 30-minute intervals)
        const allSlots = [];
        const startHour = 9;
        const endHour = 18;
        
        for (let hour = startHour; hour < endHour; hour++) {
            allSlots.push(`${hour.toString().padStart(2, '0')}:00`);
            allSlots.push(`${hour.toString().padStart(2, '0')}:30`);
        }

        // Filter out booked slots
        const bookedSlots = existingAppointments.map(appointment => appointment.time);
        const availableSlots = allSlots.filter(slot => !bookedSlots.includes(slot));

        res.json({ 
            success: true, 
            slots: availableSlots,
            totalSlots: allSlots.length,
            bookedSlots: bookedSlots.length,
            availableSlots: availableSlots.length
        });
    } catch (error) {
        console.error('Error fetching available slots:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Updated function names for consistency
const getProfile = doctorProfile;
const updateProfile = updateDoctorProfile;
const getAppointments = appointmentsDoctor;
const cancelAppointment = appointmentCancel;
const completeAppointment = appointmentComplete;
const getDashboard = doctorDashboard;

export {
    loginDoctor,
    appointmentsDoctor,
    appointmentCancel,
    doctorList,
    changeAvailablity,
    appointmentComplete,
    doctorDashboard,
    doctorProfile,
    updateDoctorProfile,
    getSpecializations,
    getDoctorsBySpecialization,
    getAvailableSlots,
    getProfile,
    updateProfile,
    getAppointments,
    cancelAppointment,
    completeAppointment,
    getDashboard
}