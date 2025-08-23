import express from "express";
import authUser from "../middleware/authUser.js";
import {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
    getDoctorsBySpecialist,
    bookAppointment,
    getUserAppointments,
    submitFeedback,
    getUserFeedback,
    submitComplaint,
    getUserComplaints,
    cancelAppointment,
    verifyStripe,
    verifyRazorpay,
    initiateRazorpayPayment,
    initiateStripePayment
} from "../controllers/userController.js";

const router = express.Router();

// Public routes (no authentication required)
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected routes (authentication required)
router.use(authUser);

// Profile routes
router.get("/profile", getUserProfile);
router.put("/profile", updateUserProfile);

// Doctor routes
router.get("/doctors/:specialistType", getDoctorsBySpecialist);

// Appointment routes
router.post("/book-appointment", bookAppointment);
router.get("/appointments", getUserAppointments);
router.post("/cancel-appointment", cancelAppointment);

// Payment routes
router.post("/verifyStripe", verifyStripe);
router.post("/verifyRazorpay", verifyRazorpay);
router.post("/payment-razorpay", initiateRazorpayPayment);
router.post("/payment-stripe", initiateStripePayment);

// Feedback routes
router.post("/feedback", submitFeedback);
router.get("/feedback", getUserFeedback);

// Complaint routes
router.post("/complaints", submitComplaint);
router.get("/complaints", getUserComplaints);

export default router;