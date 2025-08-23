import User from "../models/userModel.js";
import Doctor from "../models/doctorModel.js";
import Appointment from "../models/appointmentModel.js";
import Feedback from "../models/feedbackModel.js";
import Complaint from "../models/complaintModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";

// POST /api/user/register - Register new user
export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validation
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields"
            });
        }

        // Email validation
        if (!validator.isEmail(email)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email address"
            });
        }

        // Password validation
        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters long"
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User with this email already exists"
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = new User({
            name,
            email,
            password: hashedPassword
        });

        await user.save();

        // Generate token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            token
        });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// POST /api/user/login - Login user
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Generate token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

        res.json({
            success: true,
            message: "Login successful",
            token
        });
    } catch (error) {
        console.error("Error logging in user:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// GET /api/user/profile - Get user profile
export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.json({
            success: true,
            user
        });
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// PUT /api/user/profile - Update user profile
export const updateUserProfile = async (req, res) => {
    try {
        const { name, email, phone, address } = req.body;

        const user = await User.findByIdAndUpdate(
            req.userId,
            { name, email, phone, address },
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.json({
            success: true,
            message: "Profile updated successfully",
            user
        });
    } catch (error) {
        console.error("Error updating user profile:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// GET /api/user/doctors/:specialistType - Get doctors by specialist type
export const getDoctorsBySpecialist = async (req, res) => {
    try {
        const { specialistType } = req.params;

        const doctors = await Doctor.find({
            specialistType: specialistType,
            isAvailable: true
        }).select('name imageUrl specialistType isAvailable');

        res.json({
            success: true,
            doctors
        });
    } catch (error) {
        console.error("Error fetching doctors:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// POST /api/user/book-appointment - Book appointment
export const bookAppointment = async (req, res) => {
    try {
        const {
            doctorId,
            date,
            time,
            speciality
        } = req.body;

        // Validation
        if (!doctorId || !date || !time) {
            return res.status(400).json({
                success: false,
                message: "Doctor ID, date, and time are required"
            });
        }

        // Check if doctor exists and is available
        const doctor = await Doctor.findById(doctorId);
        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: "Doctor not found"
            });
        }

        if (!doctor.available) {
            return res.status(400).json({
                success: false,
                message: "Doctor is not available"
            });
        }

        // Check if slot is already booked
        const existingAppointment = await Appointment.findOne({
            doctorId: doctorId,
            date: date,
            time: time,
            status: { $nin: ['cancelled', 'completed'] }
        });

        if (existingAppointment) {
            return res.status(400).json({
                success: false,
                message: "This time slot is already booked"
            });
        }

        // Get user details
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Create appointment
        const appointment = new Appointment({
            userId: req.userId,
            doctorId: doctorId,
            patientName: user.name,
            age: user.age || 25,
            gender: user.gender || 'Not specified',
            disease: 'General consultation',
            speciality: speciality,
            status: 'pending',
            date: date,
            time: time,
            amount: doctor.fees,
            paymentStatus: 'pending'
        });

        await appointment.save();

        res.status(201).json({
            success: true,
            message: "Appointment booked successfully",
            appointment: {
                id: appointment._id,
                doctorName: doctor.name,
                speciality: speciality,
                date: date,
                time: time,
                amount: doctor.fees
            }
        });
    } catch (error) {
        console.error("Error booking appointment:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// GET /api/user/appointments - Get user appointments
export const getUserAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({ userId: req.userId })
            .populate('doctorId', 'name specialistType imageUrl')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            appointments
        });
    } catch (error) {
        console.error("Error fetching user appointments:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// POST /api/user/feedback - Submit feedback
export const submitFeedback = async (req, res) => {
    try {
        const { name, email, message, rating } = req.body;

        // Validation
        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                message: "Name, email, and message are required"
            });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email address"
            });
        }

        const feedback = new Feedback({
            userId: req.userId,
            name,
            email,
            message,
            rating: rating || 5
        });

        await feedback.save();

        res.status(201).json({
            success: true,
            message: "Feedback submitted successfully",
            feedback
        });
    } catch (error) {
        console.error("Error submitting feedback:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// GET /api/user/feedback - Get user feedback
export const getUserFeedback = async (req, res) => {
    try {
        const feedback = await Feedback.find({ userId: req.userId })
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            feedback
        });
    } catch (error) {
        console.error("Error fetching user feedback:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// POST /api/user/complaints - Submit complaint
export const submitComplaint = async (req, res) => {
    try {
        const { name, subject, description } = req.body;

        // Validation
        if (!name || !subject || !description) {
            return res.status(400).json({
                success: false,
                message: "Name, subject, and description are required"
            });
        }

        const complaint = new Complaint({
            userId: req.userId,
            name,
            subject,
            description
        });

        await complaint.save();

        res.status(201).json({
            success: true,
            message: "Complaint submitted successfully",
            complaint
        });
    } catch (error) {
        console.error("Error submitting complaint:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// GET /api/user/complaints - Get user complaints
export const getUserComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find({ userId: req.userId })
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            complaints
        });
    } catch (error) {
        console.error("Error fetching user complaints:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// POST /api/user/cancel-appointment - Cancel appointment
export const cancelAppointment = async (req, res) => {
    try {
        const { appointmentId } = req.body;

        if (!appointmentId) {
            return res.status(400).json({
                success: false,
                message: "Appointment ID is required"
            });
        }

        const appointment = await Appointment.findOneAndUpdate(
            { _id: appointmentId, userId: req.userId },
            { status: 'cancelled' },
            { new: true }
        );

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: "Appointment not found"
            });
        }

        res.json({
            success: true,
            message: "Appointment cancelled successfully",
            appointment
        });
    } catch (error) {
        console.error("Error cancelling appointment:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// POST /api/user/verifyStripe - Verify Stripe payment
export const verifyStripe = async (req, res) => {
    try {
        const { success, appointmentId } = req.body;

        if (!appointmentId) {
            return res.status(400).json({
                success: false,
                message: "Appointment ID is required"
            });
        }

        const appointment = await Appointment.findOneAndUpdate(
            { _id: appointmentId, userId: req.userId },
            { 
                status: success ? 'confirmed' : 'failed',
                paymentStatus: success ? 'paid' : 'failed'
            },
            { new: true }
        );

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: "Appointment not found"
            });
        }

        res.json({
            success: true,
            message: success ? "Payment verified successfully" : "Payment verification failed",
            appointment
        });
    } catch (error) {
        console.error("Error verifying Stripe payment:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// POST /api/user/verifyRazorpay - Verify Razorpay payment
export const verifyRazorpay = async (req, res) => {
    try {
        const { appointmentId, ...paymentData } = req.body;

        if (!appointmentId) {
            return res.status(400).json({
                success: false,
                message: "Appointment ID is required"
            });
        }

        const appointment = await Appointment.findOneAndUpdate(
            { _id: appointmentId, userId: req.userId },
            { 
                status: 'confirmed',
                paymentStatus: 'paid',
                paymentDetails: paymentData
            },
            { new: true }
        );

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: "Appointment not found"
            });
        }

        res.json({
            success: true,
            message: "Payment verified successfully",
            appointment
        });
    } catch (error) {
        console.error("Error verifying Razorpay payment:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// POST /api/user/payment-razorpay - Initiate Razorpay payment
export const initiateRazorpayPayment = async (req, res) => {
    try {
        const { appointmentId } = req.body;

        if (!appointmentId) {
            return res.status(400).json({
                success: false,
                message: "Appointment ID is required"
            });
        }

        const appointment = await Appointment.findOne({ _id: appointmentId, userId: req.userId })
            .populate('doctorId', 'name specialistType');

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: "Appointment not found"
            });
        }

        // Mock Razorpay order creation
        const orderData = {
            id: `order_${Date.now()}`,
            amount: 100000, // Amount in paise (₹1000)
            currency: "INR",
            receipt: `receipt_${appointmentId}`,
            status: "created"
        };

        res.json({
            success: true,
            message: "Payment order created successfully",
            order: orderData
        });
    } catch (error) {
        console.error("Error creating Razorpay order:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// POST /api/user/payment-stripe - Initiate Stripe payment
export const initiateStripePayment = async (req, res) => {
    try {
        const { appointmentId } = req.body;

        if (!appointmentId) {
            return res.status(400).json({
                success: false,
                message: "Appointment ID is required"
            });
        }

        const appointment = await Appointment.findOne({ _id: appointmentId, userId: req.userId })
            .populate('doctorId', 'name specialistType');

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: "Appointment not found"
            });
        }

        // Mock Stripe payment intent creation
        const paymentIntent = {
            id: `pi_${Date.now()}`,
            amount: 100000, // Amount in cents ($1000)
            currency: "usd",
            status: "requires_payment_method",
            client_secret: `pi_${Date.now()}_secret_${Math.random().toString(36).substr(2, 9)}`
        };

        res.json({
            success: true,
            message: "Payment intent created successfully",
            paymentIntent
        });
    } catch (error) {
        console.error("Error creating Stripe payment intent:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};