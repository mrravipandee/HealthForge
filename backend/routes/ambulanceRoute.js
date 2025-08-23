import express from "express";
import { 
    createAmbulance,
    getAllAmbulances,
    getAmbulanceById,
    updateAmbulance,
    updateAmbulanceStatus,
    updateAmbulanceLocation,
    deleteAmbulance,
    getAmbulanceStats
} from "../controllers/ambulanceController.js";
import authAdmin from "../middleware/authAdmin.js";

const router = express.Router();

// All ambulance routes require admin authentication
router.use(authAdmin);

// Ambulance CRUD operations
router.post("/", createAmbulance);
router.get("/", getAllAmbulances);
router.get("/stats", getAmbulanceStats);
router.get("/:id", getAmbulanceById);
router.put("/:id", updateAmbulance);
router.put("/:id/status", updateAmbulanceStatus);
router.put("/:id/location", updateAmbulanceLocation);
router.delete("/:id", deleteAmbulance);

export default router;
