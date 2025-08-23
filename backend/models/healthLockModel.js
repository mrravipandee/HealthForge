import mongoose from 'mongoose';

const healthLockSchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true
    },
    fileName: {
        type: String,
        required: true
    },
    originalFileName: {
        type: String,
        required: true
    },
    fileType: {
        type: String,
        required: true,
        enum: ['pdf', 'image', 'prescription', 'lab-report', 'xray', 'other']
    },
    fileSize: {
        type: Number,
        required: true
    },
    encryptedFileUrl: {
        type: String,
        required: true
    },
    fileHash: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        enum: ['doctor', 'pharmacist', 'diagnostic'],
        default: 'doctor'
    },
    permissions: {
        type: String,
        required: true,
        enum: ['full', 'partial', 'read-only'],
        default: 'full'
    },
    description: {
        type: String,
        default: ''
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Index for efficient queries
healthLockSchema.index({ patientId: 1, doctorId: 1 });
healthLockSchema.index({ createdAt: -1 });

export default mongoose.model('HealthLock', healthLockSchema);
