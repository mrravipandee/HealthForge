import Ambulance from "../models/ambulanceModel.js";

// POST /api/ambulances - Create new ambulance
export const createAmbulance = async (req, res) => {
    try {
        console.log('Creating ambulance with data:', req.body);
        
        const {
            driverName,
            driverMobile,
            vehicleNumber,
            vehicleType,
            currentLocation,
            currentAddress
        } = req.body;

        // Validation
        if (!driverName || !driverMobile || !vehicleNumber) {
            console.log('Missing required fields:', { driverName, driverMobile, vehicleNumber });
            return res.status(400).json({
                success: false,
                message: "Driver name, mobile, and vehicle number are required"
            });
        }

        // Mobile number validation
        const mobileRegex = /^[6-9]\d{9}$/;
        if (!mobileRegex.test(driverMobile)) {
            console.log('Invalid mobile number:', driverMobile);
            return res.status(400).json({
                success: false,
                message: "Please enter a valid 10-digit mobile number"
            });
        }

        // Check if vehicle number already exists
        const existingAmbulance = await Ambulance.findOne({ vehicleNumber: vehicleNumber.toUpperCase() });
        if (existingAmbulance) {
            console.log('Vehicle number already exists:', vehicleNumber);
            return res.status(400).json({
                success: false,
                message: "Vehicle number already exists"
            });
        }

        const ambulanceData = {
            driverName: driverName.trim(),
            driverMobile: driverMobile.trim(),
            vehicleNumber: vehicleNumber.toUpperCase().trim(),
            vehicleType: vehicleType || 'Basic Life Support',
            currentAddress: currentAddress || null
        };

        console.log('Creating ambulance with data:', ambulanceData);

        const ambulance = new Ambulance(ambulanceData);
        await ambulance.save();

        console.log('Ambulance created successfully:', ambulance._id);

        res.status(201).json({
            success: true,
            message: "Ambulance added successfully",
            ambulance
        });

    } catch (error) {
        console.error("Error creating ambulance:", error);
        console.error("Error stack:", error.stack);
        console.error("Error name:", error.name);
        console.error("Error code:", error.code);
        
        // Handle specific MongoDB validation errors
        if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: "Validation error: " + validationErrors.join(', ')
            });
        }
        
        // Handle duplicate key errors
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "Vehicle number already exists"
            });
        }
        
        // Handle geospatial errors
        if (error.message && error.message.includes('geo')) {
            console.error("Geospatial error detected, trying without location");
            try {
                const ambulanceDataWithoutLocation = {
                    driverName: driverName.trim(),
                    driverMobile: driverMobile.trim(),
                    vehicleNumber: vehicleNumber.toUpperCase().trim(),
                    vehicleType: vehicleType || 'Basic Life Support',
                    currentAddress: currentAddress || null
                };
                
                const ambulance = new Ambulance(ambulanceDataWithoutLocation);
                await ambulance.save();
                
                return res.status(201).json({
                    success: true,
                    message: "Ambulance added successfully (without location)",
                    ambulance
                });
            } catch (retryError) {
                console.error("Retry error:", retryError);
                return res.status(500).json({
                    success: false,
                    message: "Internal server error: " + retryError.message
                });
            }
        }
        
        res.status(500).json({
            success: false,
            message: "Internal server error: " + error.message
        });
    }
};

// GET /api/ambulances - Get all ambulances
export const getAllAmbulances = async (req, res) => {
    try {
        const { status, isAvailable, page = 1, limit = 10 } = req.query;
        
        let query = {};
        if (status && status !== 'all') {
            query.status = status;
        }
        if (isAvailable !== undefined) {
            query.isAvailable = isAvailable === 'true';
        }

        const ambulances = await Ambulance.find(query)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Ambulance.countDocuments(query);

        res.status(200).json({
            success: true,
            ambulances,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });

    } catch (error) {
        console.error("Error fetching ambulances:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// GET /api/ambulances/:id - Get single ambulance by ID
export const getAmbulanceById = async (req, res) => {
    try {
        const { id } = req.params;

        const ambulance = await Ambulance.findById(id)
            .populate('currentEmergency', 'name cause location status');

        if (!ambulance) {
            return res.status(404).json({
                success: false,
                message: "Ambulance not found"
            });
        }

        res.status(200).json({
            success: true,
            ambulance
        });

    } catch (error) {
        console.error("Error fetching ambulance:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// PUT /api/ambulances/:id - Update ambulance
export const updateAmbulance = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Remove fields that shouldn't be updated directly
        delete updateData.totalEmergencies;
        delete updateData.completedEmergencies;
        delete updateData.rating;
        delete updateData.lastActive;

        const ambulance = await Ambulance.findById(id);
        if (!ambulance) {
            return res.status(404).json({
                success: false,
                message: "Ambulance not found"
            });
        }

        // If vehicle number is being updated, check for duplicates
        if (updateData.vehicleNumber && updateData.vehicleNumber !== ambulance.vehicleNumber) {
            const existingAmbulance = await Ambulance.findOne({ 
                vehicleNumber: updateData.vehicleNumber.toUpperCase(),
                _id: { $ne: id }
            });
            if (existingAmbulance) {
                return res.status(400).json({
                    success: false,
                    message: "Vehicle number already exists"
                });
            }
            updateData.vehicleNumber = updateData.vehicleNumber.toUpperCase();
        }

        // If mobile is being updated, validate it
        if (updateData.driverMobile) {
            const mobileRegex = /^[6-9]\d{9}$/;
            if (!mobileRegex.test(updateData.driverMobile)) {
                return res.status(400).json({
                    success: false,
                    message: "Please enter a valid 10-digit mobile number"
                });
            }
        }

        const updatedAmbulance = await Ambulance.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: "Ambulance updated successfully",
            ambulance: updatedAmbulance
        });

    } catch (error) {
        console.error("Error updating ambulance:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// PUT /api/ambulances/:id/status - Update ambulance status
export const updateAmbulanceStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ['Active', 'Inactive', 'On Call', 'Maintenance'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status"
            });
        }

        const ambulance = await Ambulance.findById(id);
        if (!ambulance) {
            return res.status(404).json({
                success: false,
                message: "Ambulance not found"
            });
        }

        ambulance.status = status;
        ambulance.lastActive = new Date();

        // If status is Inactive or Maintenance, make ambulance unavailable
        if (status === 'Inactive' || status === 'Maintenance') {
            ambulance.isAvailable = false;
        }

        await ambulance.save();

        res.status(200).json({
            success: true,
            message: "Ambulance status updated successfully",
            ambulance
        });

    } catch (error) {
        console.error("Error updating ambulance status:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// PUT /api/ambulances/:id/location - Update ambulance location
export const updateAmbulanceLocation = async (req, res) => {
    try {
        const { id } = req.params;
        const { lat, lng, address } = req.body;

        if (!lat || !lng) {
            return res.status(400).json({
                success: false,
                message: "Location coordinates are required"
            });
        }

        const ambulance = await Ambulance.findById(id);
        if (!ambulance) {
            return res.status(404).json({
                success: false,
                message: "Ambulance not found"
            });
        }

        ambulance.currentLocation = { lat, lng };
        ambulance.currentAddress = address || null;
        ambulance.lastActive = new Date();

        await ambulance.save();

        res.status(200).json({
            success: true,
            message: "Ambulance location updated successfully",
            ambulance
        });

    } catch (error) {
        console.error("Error updating ambulance location:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// DELETE /api/ambulances/:id - Delete ambulance
export const deleteAmbulance = async (req, res) => {
    try {
        const { id } = req.params;

        const ambulance = await Ambulance.findById(id);
        if (!ambulance) {
            return res.status(404).json({
                success: false,
                message: "Ambulance not found"
            });
        }

        // Check if ambulance is currently on a call
        if (ambulance.currentEmergency) {
            return res.status(400).json({
                success: false,
                message: "Cannot delete ambulance while on emergency call"
            });
        }

        await Ambulance.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Ambulance deleted successfully"
        });

    } catch (error) {
        console.error("Error deleting ambulance:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// GET /api/ambulances/stats - Get ambulance statistics
export const getAmbulanceStats = async (req, res) => {
    try {
        const totalAmbulances = await Ambulance.countDocuments();
        const activeAmbulances = await Ambulance.countDocuments({ status: 'Active' });
        const availableAmbulances = await Ambulance.countDocuments({ isAvailable: true });
        const onCallAmbulances = await Ambulance.countDocuments({ status: 'On Call' });

        const totalEmergencies = await Ambulance.aggregate([
            { $group: { _id: null, total: { $sum: "$totalEmergencies" } } }
        ]);

        const completedEmergencies = await Ambulance.aggregate([
            { $group: { _id: null, total: { $sum: "$completedEmergencies" } } }
        ]);

        res.status(200).json({
            success: true,
            stats: {
                totalAmbulances,
                activeAmbulances,
                availableAmbulances,
                onCallAmbulances,
                totalEmergencies: totalEmergencies[0]?.total || 0,
                completedEmergencies: completedEmergencies[0]?.total || 0
            }
        });

    } catch (error) {
        console.error("Error fetching ambulance stats:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
