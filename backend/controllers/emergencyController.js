import Emergency from "../models/emergencyModel.js";
import Ambulance from "../models/ambulanceModel.js";

// POST /api/emergency - Create new emergency request
export const createEmergency = async (req, res) => {
    try {
        const {
            name,
            gender,
            cause,
            mobile,
            witnessMobile,
            state,
            district,
            city,
            location
        } = req.body;

        // Parse location if it's a string (from FormData)
        let parsedLocation = location;
        if (typeof location === 'string') {
            try {
                parsedLocation = JSON.parse(location);
            } catch (error) {
                console.error('Error parsing location:', error);
                return res.status(400).json({
                    success: false,
                    message: "Invalid location data format"
                });
            }
        }

        // Validation
        if (!name || !gender || !cause || !mobile || !witnessMobile || !state || !district || !city || !parsedLocation) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // Mobile number validation
        const mobileRegex = /^[6-9]\d{9}$/;
        if (!mobileRegex.test(mobile) || !mobileRegex.test(witnessMobile)) {
            return res.status(400).json({
                success: false,
                message: "Please enter valid 10-digit mobile numbers"
            });
        }

        // Location validation
        if (!parsedLocation.lat || !parsedLocation.lng) {
            return res.status(400).json({
                success: false,
                message: "Location coordinates are required"
            });
        }

        // Handle image upload
        let imageUrl = null;
        if (req.file) {
            imageUrl = `/uploads/${req.file.filename}`;
        }

        const emergency = new Emergency({
            name,
            gender,
            cause,
            mobile,
            witnessMobile,
            imageUrl,
            state,
            district,
            city,
            location: parsedLocation
        });

        await emergency.save();

        // Find nearest available ambulance
        const nearestAmbulance = await findNearestAmbulance(parsedLocation);

        // TODO: Implement real-time notification using Socket.io
        // emitEmergencyAlert(emergency, nearestAmbulance);

        res.status(201).json({
            success: true,
            message: "Emergency reported successfully, ambulance is on the way!",
            emergency,
            nearestAmbulance: nearestAmbulance ? {
                id: nearestAmbulance._id,
                driverName: nearestAmbulance.driverName,
                vehicleNumber: nearestAmbulance.vehicleNumber,
                estimatedTime: calculateEstimatedTime(parsedLocation, nearestAmbulance.currentLocation)
            } : null
        });

    } catch (error) {
        console.error("Error creating emergency:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// GET /api/emergencies - Get all emergencies (admin only)
export const getAllEmergencies = async (req, res) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;
        
        let query = {};
        if (status && status !== 'all') {
            query.status = status;
        }

        const emergencies = await Emergency.find(query)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .populate('assignedAmbulance', 'driverName vehicleNumber driverMobile');

        const total = await Emergency.countDocuments(query);

        res.status(200).json({
            success: true,
            emergencies,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });

    } catch (error) {
        console.error("Error fetching emergencies:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// GET /api/emergencies/:id - Get single emergency by ID
export const getEmergencyById = async (req, res) => {
    try {
        const { id } = req.params;

        const emergency = await Emergency.findById(id)
            .populate('assignedAmbulance', 'driverName vehicleNumber driverMobile currentLocation');

        if (!emergency) {
            return res.status(404).json({
                success: false,
                message: "Emergency not found"
            });
        }

        res.status(200).json({
            success: true,
            emergency
        });

    } catch (error) {
        console.error("Error fetching emergency:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// PUT /api/emergencies/:id/assign - Assign ambulance to emergency
export const assignAmbulance = async (req, res) => {
    try {
        const { id } = req.params;
        const { ambulanceId } = req.body;

        if (!ambulanceId) {
            return res.status(400).json({
                success: false,
                message: "Ambulance ID is required"
            });
        }

        const emergency = await Emergency.findById(id);
        if (!emergency) {
            return res.status(404).json({
                success: false,
                message: "Emergency not found"
            });
        }

        const ambulance = await Ambulance.findById(ambulanceId);
        if (!ambulance) {
            return res.status(404).json({
                success: false,
                message: "Ambulance not found"
            });
        }

        if (!ambulance.isAvailable) {
            return res.status(400).json({
                success: false,
                message: "Ambulance is not available"
            });
        }

        // Update emergency
        emergency.assignedAmbulance = ambulanceId;
        emergency.status = 'Assigned';
        emergency.estimatedArrival = calculateEstimatedArrival(emergency.location, ambulance.currentLocation);
        await emergency.save();

        // Update ambulance
        ambulance.isAvailable = false;
        ambulance.currentEmergency = id;
        ambulance.totalEmergencies += 1;
        await ambulance.save();

        res.status(200).json({
            success: true,
            message: "Ambulance assigned successfully",
            emergency
        });

    } catch (error) {
        console.error("Error assigning ambulance:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// PUT /api/emergencies/:id/status - Update emergency status
export const updateEmergencyStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ['Pending', 'Assigned', 'In Transit', 'Completed', 'Cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status"
            });
        }

        const emergency = await Emergency.findById(id);
        if (!emergency) {
            return res.status(404).json({
                success: false,
                message: "Emergency not found"
            });
        }

        emergency.status = status;

        // If completed, free up the ambulance
        if (status === 'Completed' && emergency.assignedAmbulance) {
            const ambulance = await Ambulance.findById(emergency.assignedAmbulance);
            if (ambulance) {
                ambulance.isAvailable = true;
                ambulance.currentEmergency = null;
                ambulance.completedEmergencies += 1;
                await ambulance.save();
            }
        }

        await emergency.save();

        res.status(200).json({
            success: true,
            message: "Emergency status updated successfully",
            emergency
        });

    } catch (error) {
        console.error("Error updating emergency status:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// Helper function to find nearest available ambulance
const findNearestAmbulance = async (emergencyLocation) => {
    try {
        const ambulance = await Ambulance.findOne({
            isAvailable: true,
            status: 'Active',
            currentLocation: {
                $exists: true,
                $ne: null
            }
        }).sort({
            currentLocation: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [emergencyLocation.lng, emergencyLocation.lat]
                    }
                }
            }
        });

        return ambulance;
    } catch (error) {
        console.error("Error finding nearest ambulance:", error);
        return null;
    }
};

// Helper function to calculate estimated time
const calculateEstimatedTime = (emergencyLocation, ambulanceLocation) => {
    if (!ambulanceLocation || !ambulanceLocation.lat || !ambulanceLocation.lng) {
        return "Unknown";
    }

    // Simple distance calculation (Haversine formula)
    const R = 6371; // Earth's radius in km
    const dLat = (emergencyLocation.lat - ambulanceLocation.lat) * Math.PI / 180;
    const dLng = (emergencyLocation.lng - ambulanceLocation.lng) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(ambulanceLocation.lat * Math.PI / 180) * Math.cos(emergencyLocation.lat * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;

    // Assume average speed of 40 km/h in city
    const estimatedMinutes = Math.round((distance / 40) * 60);
    
    return `${estimatedMinutes} minutes`;
};

// Helper function to calculate estimated arrival time
const calculateEstimatedArrival = (emergencyLocation, ambulanceLocation) => {
    if (!ambulanceLocation || !ambulanceLocation.lat || !ambulanceLocation.lng) {
        return null;
    }

    const estimatedMinutes = calculateEstimatedTime(emergencyLocation, ambulanceLocation);
    const minutes = parseInt(estimatedMinutes);
    
    const arrivalTime = new Date();
    arrivalTime.setMinutes(arrivalTime.getMinutes() + minutes);
    
    return arrivalTime;
};
