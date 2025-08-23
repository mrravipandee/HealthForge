import express from "express"
import cors from 'cors'
import 'dotenv/config'
import connectDB from "./config/mongodb.js"
import connectCloudinary from "./config/cloudinary.js"
import userRouter from "./routes/userRoute.js"
import doctorRouter from "./routes/doctorRoute.js"
import adminRouter from "./routes/adminRoute.js"
import feedbackRouter from "./routes/feedbackRoute.js"
import emergencyRouter from "./routes/emergencyRoute.js"
import ambulanceRouter from "./routes/ambulanceRoute.js"
import healthLockRouter from "./routes/healthLockRoute.js"
import bcrypt from 'bcryptjs'
import doctorModel from "./models/doctorModel.js"

// app config
const app = express()
const port = process.env.PORT || 3000
connectDB()
connectCloudinary()

// middlewares
app.use(express.json())
app.use(cors())

// Serve static files (for uploaded images)
app.use('/uploads', express.static('uploads'))

// Temporary route to create test doctor (remove in production)
app.post("/create-test-doctor", async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash('doctor123', 10);
        const doctor = new doctorModel({
            name: 'Dr. John Smith',
            email: 'doctor@healthforge.com',
            password: hashedPassword,
            speciality: 'General Physician',
            experience: '5 Years',
            fees: 1000,
            about: 'Experienced general physician',
            available: true
        });
        await doctor.save();
        res.json({ success: true, message: 'Test doctor created successfully' });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
});

// api endpoints
app.use("/api/user", userRouter)
app.use("/api/admin", adminRouter)
app.use("/api/doctor", doctorRouter)
app.use("/api/feedback", feedbackRouter)
app.use("/api/emergency", emergencyRouter)
app.use("/api/ambulance", ambulanceRouter)
app.use("/api/healthlock", healthLockRouter)

app.get("/", (req, res) => {
  res.send("API Working")
});

// Test endpoint for debugging
app.get("/test", (req, res) => {
  res.json({ 
    success: true, 
    message: "Server is working",
    timestamp: new Date().toISOString()
  });
});

app.listen(port, () => console.log(`Server started on PORT:${port}`))