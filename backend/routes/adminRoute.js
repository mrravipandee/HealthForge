import express from 'express';
import { loginAdmin, appointmentsAdmin, appointmentCancel, addDoctor, allDoctors, adminDashboard, updateDoctor, deleteDoctor } from '../controllers/adminController.js';
import { changeAvailablity } from '../controllers/doctorController.js';
import authAdmin from '../middleware/authAdmin.js';
import upload from '../middleware/multer.js';
const adminRouter = express.Router();

adminRouter.post("/login", loginAdmin)

// Add doctor
adminRouter.post("/add-doctor", (req, res, next) => {
    console.log('Add doctor route hit');
    console.log('Headers:', req.headers);
    next();
}, authAdmin, (req, res, next) => {
    console.log('After authAdmin middleware');
    next();
}, upload.single('image'), (req, res, next) => {
    console.log('After multer middleware');
    console.log('File:', req.file);
    console.log('Body:', req.body);
    next();
}, addDoctor)

// Update doctor
adminRouter.put("/doctors/:doctorId", authAdmin, upload.single('image'), updateDoctor)

// Delete doctor
adminRouter.delete("/doctors/:doctorId", authAdmin, deleteDoctor)

adminRouter.get("/appointments", authAdmin, appointmentsAdmin)
adminRouter.post("/cancel-appointment", authAdmin, appointmentCancel)
adminRouter.get("/all-doctors", authAdmin, allDoctors)
adminRouter.post("/change-availability", authAdmin, changeAvailablity)
adminRouter.get("/dashboard", authAdmin, adminDashboard)

export default adminRouter;