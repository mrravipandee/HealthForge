import mongoose from 'mongoose';

const accessLogSchema = new mongoose.Schema({
    healthLockId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'HealthLock',
        required: true
    },
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
    accessType: {
        type: String,
        required: true,
        enum: ['qr-scan', 'file-view', 'file-download']
    },
    accessMethod: {
        type: String,
        required: true,
        enum: ['qr-code', 'direct-link', 'api']
    },
    ipAddress: {
        type: String,
        required: true
    },
    userAgent: {
        type: String,
        required: true
    },
    location: {
        type: {
            latitude: Number,
            longitude: Number,
            city: String,
            country: String
        },
        default: null
    },
    success: {
        type: Boolean,
        required: true,
        default: true
    },
    errorMessage: {
        type: String,
        default: null
    },
    accessDuration: {
        type: Number, // in seconds
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Index for efficient queries
accessLogSchema.index({ healthLockId: 1, createdAt: -1 });
accessLogSchema.index({ patientId: 1, createdAt: -1 });
accessLogSchema.index({ doctorId: 1, createdAt: -1 });

export default mongoose.model('AccessLog', accessLogSchema);
