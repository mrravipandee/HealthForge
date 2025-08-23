import express from "express";
import { loginDoctor, getProfile, updateProfile, getAppointments, cancelAppointment, completeAppointment, getDashboard, doctorList } from "../controllers/doctorController.js";
import { getSpecializations, getDoctorsBySpecialization, getAvailableSlots } from "../controllers/doctorController.js";
import authDoctor from "../middleware/authDoctor.js";

const doctorRouter = express.Router();

// Public routes (no authentication required)
doctorRouter.get("/list", doctorList);
doctorRouter.get("/specializations", getSpecializations);
doctorRouter.get("/by-specialization/:specialization", getDoctorsBySpecialization);
doctorRouter.get("/:doctorId/slots", getAvailableSlots);

// Protected routes (require doctor authentication)
doctorRouter.post("/login", loginDoctor);
doctorRouter.get("/profile", authDoctor, getProfile);
doctorRouter.post("/update-profile", authDoctor, updateProfile);
doctorRouter.get("/appointments", authDoctor, getAppointments);
doctorRouter.post("/cancel-appointment", authDoctor, cancelAppointment);
doctorRouter.post("/complete-appointment", authDoctor, completeAppointment);
doctorRouter.get("/dashboard", authDoctor, getDashboard);

export default doctorRouter;