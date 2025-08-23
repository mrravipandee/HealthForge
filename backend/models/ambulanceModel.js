import mongoose from "mongoose";

const ambulanceSchema = new mongoose.Schema({
    driverName: {
        type: String,
        required: true,
        trim: true
    },
    driverMobile: {
        type: String,
        required: true,
        trim: true,
        match: [/^[6-9]\d{9}$/, 'Please enter a valid 10-digit mobile number starting with 6-9']
    },
    vehicleNumber: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        uppercase: true
    },
    vehicleType: {
        type: String,
        enum: ['Basic Life Support', 'Advanced Life Support', 'Cardiac Ambulance'],
        default: 'Basic Life Support'
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive', 'On Call', 'Maintenance'],
        default: 'Active'
    },
    currentLocation: {
        lat: Number,
        lng: Number
    },
    currentAddress: {
        type: String,
        default: null
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    currentEmergency: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Emergency',
        default: null
    },
    totalEmergencies: {
        type: Number,
        default: 0
    },
    completedEmergencies: {
        type: Number,
        default: 0
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    },
    lastActive: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Index for status-based queries
ambulanceSchema.index({ status: 1, isAvailable: 1 });

const Ambulance = mongoose.model('Ambulance', ambulanceSchema);

export default Ambulance;
