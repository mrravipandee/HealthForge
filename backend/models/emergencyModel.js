import mongoose from "mongoose";

const emergencySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    gender: {
        type: String,
        required: true,
        enum: ['Male', 'Female', 'Other'],
        trim: true
    },
    cause: {
        type: String,
        required: true,
        trim: true
    },
    mobile: {
        type: String,
        required: true,
        trim: true,
        match: [/^[6-9]\d{9}$/, 'Please enter a valid 10-digit mobile number']
    },
    witnessMobile: {
        type: String,
        required: true,
        trim: true,
        match: [/^[6-9]\d{9}$/, 'Please enter a valid 10-digit mobile number']
    },
    imageUrl: {
        type: String,
        default: null
    },
    state: {
        type: String,
        required: true,
        trim: true
    },
    district: {
        type: String,
        required: true,
        trim: true
    },
    city: {
        type: String,
        required: true,
        trim: true
    },
    location: {
        lat: {
            type: Number,
            required: true
        },
        lng: {
            type: Number,
            required: true
        }
    },
    status: {
        type: String,
        enum: ['Pending', 'Assigned', 'In Transit', 'Completed', 'Cancelled'],
        default: 'Pending'
    },
    assignedAmbulance: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ambulance',
        default: null
    },
    estimatedArrival: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

// Index for location-based queries
emergencySchema.index({ location: '2dsphere' });

// Index for status-based queries
emergencySchema.index({ status: 1, createdAt: -1 });

const Emergency = mongoose.model('Emergency', emergencySchema);

export default Emergency;
