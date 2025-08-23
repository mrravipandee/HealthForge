import mongoose from "mongoose"

const appointmentSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    doctorId: { type: String, required: true },
    patientName: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    insurance: { type: String, default: '' },
    disease: { type: String, required: true },
    speciality: { type: String, required: true },
    status: { type: String, enum: ['pending', 'confirmed', 'cancelled', 'completed', 'failed'], default: 'pending' },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
    date: { type: String, required: true }, // Changed to String for YYYY-MM-DD format
    time: { type: String, required: true }, // Changed from slotTime to time
    amount: { type: Number, required: true },
    paymentDetails: { type: Object, default: {} },
    createdAt: { type: Date, default: Date.now }
})

const appointmentModel = mongoose.models.appointment || mongoose.model("appointment", appointmentSchema)
export default appointmentModel