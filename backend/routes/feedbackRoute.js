import express from "express";
import { createFeedback, getAllFeedbacks, getFeedbackById, deleteFeedback } from "../controllers/feedbackController.js";
import authAdmin from "../middleware/authAdmin.js";

const router = express.Router();

// Public route - anyone can submit feedback
router.post("/", createFeedback);

// Admin routes - require authentication
router.get("/feedbacks", authAdmin, getAllFeedbacks);
router.get("/feedbacks/:id", authAdmin, getFeedbackById);
router.delete("/feedbacks/:id", authAdmin, deleteFeedback);

export default router;
