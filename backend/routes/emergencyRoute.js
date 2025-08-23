import express from "express";
import { 
    createEmergency, 
    getAllEmergencies, 
    getEmergencyById, 
    assignAmbulance, 
    updateEmergencyStatus 
} from "../controllers/emergencyController.js";
import authAdmin from "../middleware/authAdmin.js";
import upload from "../middleware/multer.js";

const router = express.Router();

// Public route - anyone can report emergency
router.post("/", upload.single('image'), createEmergency);

// Admin routes - require authentication
router.get("/emergencies", authAdmin, getAllEmergencies);
router.get("/emergencies/:id", authAdmin, getEmergencyById);
router.put("/emergencies/:id/assign", authAdmin, assignAmbulance);
router.put("/emergencies/:id/status", authAdmin, updateEmergencyStatus);

export default router;
