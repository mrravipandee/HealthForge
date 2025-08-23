import Feedback from "../models/feedbackModel.js";

// POST /api/feedback - Save new feedback
export const createFeedback = async (req, res) => {
    try {
        const { userId, name, email, message, rating } = req.body;

        // Validation
        if (!userId || !name || !email || !message || !rating) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        if (rating < 1 || rating > 5 || !Number.isInteger(Number(rating))) {
            return res.status(400).json({
                success: false,
                message: "Rating must be a whole number between 1 and 5"
            });
        }

        // Email validation
        const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email address"
            });
        }

        const feedback = new Feedback({
            userId,
            name,
            email,
            message,
            rating: Number(rating)
        });

        await feedback.save();

        res.status(201).json({
            success: true,
            message: "Feedback submitted successfully!",
            feedback
        });

    } catch (error) {
        console.error("Error creating feedback:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// GET /api/feedbacks - Get all feedbacks (admin only)
export const getAllFeedbacks = async (req, res) => {
    try {
        const feedbacks = await Feedback.find({})
            .sort({ createdAt: -1 }) // Latest first
            .select('userId name email message rating createdAt');

        res.status(200).json({
            success: true,
            count: feedbacks.length,
            feedbacks
        });

    } catch (error) {
        console.error("Error fetching feedbacks:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// GET /api/feedbacks/:id - Get single feedback by ID
export const getFeedbackById = async (req, res) => {
    try {
        const { id } = req.params;

        const feedback = await Feedback.findById(id);
        
        if (!feedback) {
            return res.status(404).json({
                success: false,
                message: "Feedback not found"
            });
        }

        res.status(200).json({
            success: true,
            feedback
        });

    } catch (error) {
        console.error("Error fetching feedback:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// DELETE /api/feedbacks/:id - Delete feedback by ID
export const deleteFeedback = async (req, res) => {
    try {
        const { id } = req.params;

        const feedback = await Feedback.findByIdAndDelete(id);
        
        if (!feedback) {
            return res.status(404).json({
                success: false,
                message: "Feedback not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Feedback deleted successfully"
        });

    } catch (error) {
        console.error("Error deleting feedback:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
