import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";
import doctorModel from "../models/doctorModel.js";
import bcrypt from 'bcryptjs';
import fs from 'fs';

import validator from "validator";
import { v2 as cloudinary } from "cloudinary";
import userModel from "../models/userModel.js";

// Helper function to convert image to base64
const imageToBase64 = (filePath) => {
    try {
        const imageBuffer = fs.readFileSync(filePath);
        const base64String = imageBuffer.toString('base64');
        const mimeType = 'image/jpeg'; // Default mime type
        return `data:${mimeType};base64,${base64String}`;
    } catch (error) {
        console.error('Error converting image to base64:', error);
        return null;
    }
};

// API for admin login
const loginAdmin = async (req, res) => {
    try {
        console.log('Admin login attempt - Email:', req.body.email);
        console.log('Admin login attempt - Expected email:', process.env.ADMIN_EMAIL);
        console.log('Admin login attempt - Expected password:', process.env.ADMIN_PASSWORD);

        const { email, password } = req.body

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign({ email, role: 'admin' }, process.env.JWT_SECRET)
            console.log('Admin login successful - Token generated');
            res.json({ success: true, token })
        } else {
            console.log('Admin login failed - Invalid credentials');
            res.json({ success: false, message: "Invalid credentials" })
        }

    } catch (error) {
        console.log('Admin login error:', error)
        res.json({ success: false, message: error.message })
    }

}


// API to get all appointments list
const appointmentsAdmin = async (req, res) => {
    try {

        const appointments = await appointmentModel.find({})
        res.json({ success: true, appointments })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API for appointment cancellation
const appointmentCancel = async (req, res) => {
    try {

        const { appointmentId } = req.body
        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })

        res.json({ success: true, message: 'Appointment Cancelled' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API for adding Doctor
const addDoctor = async (req, res) => {

    try {

        const { name, email, password, speciality, degree, experience, about, fees, address } = req.body
        const imageFile = req.file

        // checking for all data to add doctor
        if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address) {
            return res.json({ success: false, message: "Missing Details" })
        }

        // validating email format
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" })
        }

        // validating strong password
        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" })
        }

        // hashing user password
        const salt = await bcrypt.genSalt(10); // the more no. round the more time it will take
        const hashedPassword = await bcrypt.hash(password, salt)

        // upload image to cloudinary
        console.log('Uploading image to cloudinary:', imageFile);
        let imageUrl;
        
        if (!imageFile) {
            console.log('No image file provided, using default image');
            imageUrl = 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face';
        } else {
            // First try Cloudinary
            if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
                try {
                    console.log('Attempting Cloudinary upload...');
                    const imageUpload = await Promise.race([
                        cloudinary.uploader.upload(imageFile.path, { 
                            resource_type: "image",
                            timeout: 15000, // 15 second timeout
                            folder: "healthforge/doctors"
                        }),
                        new Promise((_, reject) => 
                            setTimeout(() => reject(new Error('Upload timeout')), 15000)
                        )
                    ]);
                    
                    console.log('Cloudinary upload successful:', imageUpload.secure_url);
                    imageUrl = imageUpload.secure_url;
                } catch (cloudinaryError) {
                    console.error('Cloudinary upload failed:', cloudinaryError.message);
                    // Fallback to base64
                    console.log('Falling back to base64 storage...');
                    const base64Image = imageToBase64(imageFile.path);
                    if (base64Image) {
                        imageUrl = base64Image;
                        console.log('Image converted to base64 successfully');
                    } else {
                        console.log('Base64 conversion failed, using default image');
                        imageUrl = 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face';
                    }
                }
            } else {
                // No Cloudinary credentials, use base64
                console.log('No Cloudinary credentials, using base64 storage...');
                const base64Image = imageToBase64(imageFile.path);
                if (base64Image) {
                    imageUrl = base64Image;
                    console.log('Image converted to base64 successfully');
                } else {
                    console.log('Base64 conversion failed, using default image');
                    imageUrl = 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face';
                }
            }
        }

        const doctorData = {
            name,
            email,
            image: imageUrl,
            password: hashedPassword,
            speciality,
            degree,
            experience,
            about,
            fees,
            address: JSON.parse(address),
            date: Date.now()
        }

        const newDoctor = new doctorModel(doctorData)
        await newDoctor.save()
        res.json({ success: true, message: 'Doctor Added' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get all doctors list for admin panel
const allDoctors = async (req, res) => {
    try {

        const doctors = await doctorModel.find({}).select('-password')
        res.json({ success: true, doctors })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get dashboard data for admin panel
const adminDashboard = async (req, res) => {
    try {

        const doctors = await doctorModel.find({})
        const users = await userModel.find({})
        const appointments = await appointmentModel.find({})

        const dashData = {
            doctors: doctors.length,
            appointments: appointments.length,
            patients: users.length,
            latestAppointments: appointments.reverse()
        }

        res.json({ success: true, dashData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to update doctor
const updateDoctor = async (req, res) => {
    try {
        const { doctorId } = req.params;
        const updateData = req.body;
        const imageFile = req.file;

        // Check if doctor exists
        const existingDoctor = await doctorModel.findById(doctorId);
        if (!existingDoctor) {
            return res.status(404).json({
                success: false,
                message: "Doctor not found"
            });
        }

        // Handle image upload if provided
        if (imageFile) {
            console.log('Updating doctor image:', imageFile);
            let imageUrl;
            
            if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
                try {
                    console.log('Attempting Cloudinary upload for update...');
                    const imageUpload = await Promise.race([
                        cloudinary.uploader.upload(imageFile.path, { 
                            resource_type: "image",
                            timeout: 15000,
                            folder: "healthforge/doctors"
                        }),
                        new Promise((_, reject) => 
                            setTimeout(() => reject(new Error('Upload timeout')), 15000)
                        )
                    ]);
                    
                    console.log('Cloudinary upload successful:', imageUpload.secure_url);
                    imageUrl = imageUpload.secure_url;
                } catch (cloudinaryError) {
                    console.error('Cloudinary upload failed:', cloudinaryError.message);
                    const base64Image = imageToBase64(imageFile.path);
                    if (base64Image) {
                        imageUrl = base64Image;
                        console.log('Image converted to base64 successfully');
                    }
                }
            } else {
                const base64Image = imageToBase64(imageFile.path);
                if (base64Image) {
                    imageUrl = base64Image;
                }
            }
            
            if (imageUrl) {
                updateData.image = imageUrl;
            }
        }

        // Update doctor
        const updatedDoctor = await doctorModel.findByIdAndUpdate(
            doctorId,
            updateData,
            { new: true, runValidators: true }
        ).select('-password');

        res.json({
            success: true,
            message: "Doctor updated successfully",
            doctor: updatedDoctor
        });

    } catch (error) {
        console.error("Error updating doctor:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// API to delete doctor
const deleteDoctor = async (req, res) => {
    try {
        const { doctorId } = req.params;

        // Check if doctor exists
        const existingDoctor = await doctorModel.findById(doctorId);
        if (!existingDoctor) {
            return res.status(404).json({
                success: false,
                message: "Doctor not found"
            });
        }

        // Check if doctor has any appointments
        const hasAppointments = await appointmentModel.findOne({ doctorId });
        if (hasAppointments) {
            return res.status(400).json({
                success: false,
                message: "Cannot delete doctor with existing appointments"
            });
        }

        // Delete doctor
        await doctorModel.findByIdAndDelete(doctorId);

        res.json({
            success: true,
            message: "Doctor deleted successfully"
        });

    } catch (error) {
        console.error("Error deleting doctor:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export {
    loginAdmin,
    appointmentsAdmin,
    appointmentCancel,
    addDoctor,
    allDoctors,
    adminDashboard,
    updateDoctor,
    deleteDoctor
}